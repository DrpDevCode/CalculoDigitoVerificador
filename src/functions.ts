import type { FormConfig, Weights, SerialNumberData } from '@/composables/interfaces';

export function onlyNumbers(value: string) {
  return value.replace(/[^0-9]/g, '')
}

export function generateNumbers(formConfig: FormConfig, weights: Weights[]) {
  if (formConfig.serialNumber === '' || formConfig.serialNumber === null || formConfig.serialNumber === undefined) {
    return [];
  }

  const numbers = [];
  for (let i = 0; i < formConfig.qtdRegisters; i++) {

    const serialNumber = incrementMaskedNumber(formConfig.serialNumber, i);
    const { remainder, subtract, sum, calcNumbers } = calculateDigitVerifier(serialNumber, weights, formConfig.divider);
    const serialNumberWithDigitVerifier = formConfig.hasHyphen ? `${serialNumber}-${subtract}` : `${serialNumber}${subtract}`;

    numbers.push({
      order: i + 1,
      serialNumber: serialNumber,
      digitVerifier: subtract,
      serialNumberWithDigitVerifier: serialNumberWithDigitVerifier,
      remainder: remainder,
      sum: sum,
      calcNumbers: calcNumbers,
    });
  }
  return numbers;
}

export function calculateDigitVerifier(serialNumber: string, weights: Weights[], divider: number) {
  const numbers = onlyNumbers(serialNumber);
  const calcNumbers = [];
  let remainder = 0;
  let subtract = 0;
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    calcNumbers.push({
      number: parseInt(numbers[i] || '0'),
      weight: weights[i]?.weight || 0,
      result: parseInt(numbers[i] || '0') * (weights[i]?.weight || 0)
    });
    sum += calcNumbers[i]?.result || 0;
  }

  remainder = sum % divider;
  subtract = divider - remainder;
  return {
    remainder: remainder,
    subtract: subtract > 9 ? 0 : subtract,
    sum: sum,
    calcNumbers: calcNumbers,
  };
}

export function incrementMaskedNumber(value: string, increment: number): string {
  if (value === '' || value === null || value === undefined) {
    return ''
  }

  const match = value.match(/(.*?)(\d+)$/)

  if (!match) {
    throw new Error('Número de série inválido')
  }

  const prefix = match[1]       // "1010-"
  const numberPart = match[2]   // "12"
  const length = numberPart?.length || 0

  const newNumber = (parseInt(numberPart || '0', 10) + increment)
    .toString()
    .padStart(length, '0')

  return `${prefix}${newNumber}`
}

export function downloadTxtFile(serialNumbers: SerialNumberData[]): void {
  if (serialNumbers.length === 0) {
    return;
  }

  // Gerar conteúdo do arquivo TXT
  let content = 'Números de Série Gerados\n';
  content += '='.repeat(50) + '\n\n';

  serialNumbers.forEach((item) => {
    content += `Ordem: ${item.order}\n`;
    content += `Número de Série: ${item.serialNumber}\n`;
    content += `Dígito Verificador: ${item.digitVerifier}\n`;
    content += `Número Completo: ${item.serialNumberWithDigitVerifier}\n`;
    content += '-'.repeat(50) + '\n';
  });

  downloader(content);
}

export function downloadTxtFileSimple(serialNumbers: SerialNumberData[]): void {
  if (serialNumbers.length === 0) {
    return;
  }

  let content = '';
  serialNumbers.forEach((item) => {
    content += `${item.serialNumberWithDigitVerifier}\n`;
  });
  downloader(content);
}

export function downloader(content: string): void {
  // Criar blob e fazer download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Nome do arquivo com data/hora
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
  link.download = `numeros_serie_${dateStr}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}