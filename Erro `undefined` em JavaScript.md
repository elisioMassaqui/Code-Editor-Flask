# Erro `undefined` em JavaScript

O erro `undefined` ocorre quando você tenta acessar uma propriedade ou variável que não foi definida. Aqui está um exemplo de como isso pode ocorrer e como corrigir:

### Exemplo de Código

```javascript
// Causa do erro `undefined`
fetch('/api/endpoint')
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // undefined se "message" não existir
    });

// Solução para evitar `undefined`
fetch('/api/endpoint')
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message); // Exibe a mensagem se existir
        } else {
            console.error('A propriedade "message" está ausente.'); // Mensagem de erro se "message" não existir
        }
    });
```

No exemplo acima, a primeira parte pode resultar em undefined se a propriedade message não estiver presente na resposta da API. A segunda parte mostra como adicionar uma verificação condicional para garantir que a propriedade existe antes de acessá-la.