# Configuração das Regras de Segurança do Firestore

## Problema
Se você está recebendo o erro "Missing or insufficient permissions" ao tentar salvar configurações, é porque as regras de segurança do Firestore não estão configuradas corretamente.

## Solução

### Opção 1: Configurar via Firebase Console (Recomendado)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, vá em **Firestore Database**
4. Clique na aba **Regras** (Rules)
5. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção 'configs'
    match /configs/{configId} {
      // Permite leitura apenas se o usuário estiver autenticado e for o dono da configuração
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Permite criação apenas se o usuário estiver autenticado e o userId corresponder ao usuário logado
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Permite atualização apenas se o usuário estiver autenticado e for o dono da configuração
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Permite exclusão apenas se o usuário estiver autenticado e for o dono da configuração
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

6. Clique em **Publicar** (Publish)

### Opção 2: Usando Firebase CLI

Se você tem o Firebase CLI instalado e configurado:

1. Certifique-se de que o arquivo `firestore.rules` está na raiz do projeto (já foi criado)
2. Execute o comando:
```bash
firebase deploy --only firestore:rules
```

## O que essas regras fazem?

- **read**: Usuários autenticados podem ler apenas suas próprias configurações
- **create**: Usuários autenticados podem criar configurações, mas o `userId` deve corresponder ao ID do usuário logado
- **update**: Usuários autenticados podem atualizar apenas suas próprias configurações
- **delete**: Usuários autenticados podem excluir apenas suas próprias configurações

## Importante

⚠️ **Nunca** use regras como estas em produção sem autenticação adequada:
```javascript
// ❌ NUNCA FAÇA ISSO EM PRODUÇÃO
allow read, write: if true;
```

As regras fornecidas garantem que cada usuário só possa acessar suas próprias configurações.

## Índice Composto Necessário

Após configurar as regras, você também precisará criar um índice composto para a query que combina `where` e `orderBy`.

### Como criar o índice:

1. Quando você tentar carregar as configurações pela primeira vez, o Firebase mostrará um erro com um link
2. Clique no link fornecido no erro (ou acesse diretamente)
3. Isso abrirá o Firebase Console na página de criação de índices
4. Clique em **Criar Índice** (Create Index)

**OU** você pode criar manualmente:

1. Acesse o Firebase Console
2. Vá em **Firestore Database** > **Índices** (Indexes)
3. Clique em **Criar Índice** (Create Index)
4. Configure:
   - **Coleção**: `configs`
   - **Campos para indexar**:
     - `userId` (Ascendente)
     - `updatedAt` (Descendente)
   - **Modo de consulta**: Coleção
5. Clique em **Criar**

## Verificação

Após configurar as regras e o índice:
1. Faça login na aplicação
2. Tente salvar uma configuração
3. O erro de permissões não deve mais aparecer
4. As configurações devem ser carregadas corretamente
