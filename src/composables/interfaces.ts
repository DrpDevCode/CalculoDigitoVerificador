export interface FormConfig {
    serialNumber: string;
    qtdRegisters: number;
    qtdNumbers: number;
    divider: number;
    hasHyphen: boolean;
}

export interface Weights {
    position: number;
    weight: number;
}

export interface CalculatedNumber {
    order: number;
    number: number;
    weight: number;
    result: number;
}

export interface SerialNumberData {
    order: number;
    serialNumber: string;
    digitVerifier: number;
    serialNumberWithDigitVerifier: string;
    remainder?: number;
    sum?: number;
    calcNumbers?: any[];
}