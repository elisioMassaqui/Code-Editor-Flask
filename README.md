# Arduino Project Manager

Um gerenciador de projetos Arduino baseado em web. Permite criar, carregar, salvar, compilar e enviar código para placas Arduino.

## Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Uso](#uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Este projeto é uma aplicação web que facilita o gerenciamento de projetos Arduino. O frontend é desenvolvido com HTML, CSS e JavaScript, usando o Monaco Editor para edição de código. O backend é feito com Flask e interage com o `arduino-cli` para manipular o código e a placa Arduino.

## Instalação

### Requisitos

- Python 3.x
- Flask
- `arduino-cli`

### Backend

4. Configure o `arduino-cli` e ajuste o caminho no código se necessário.

5. Inicie o servidor Flask:
    ```bash
    python app.py
    ```

### Frontend

1. Adicione o código HTML e CSS no diretório `static` do Flask.

2. Certifique-se de que o Monaco Editor é carregado corretamente com a configuração CDN.

## Uso

1. **Criar Projeto**: Insira o nome do projeto e clique em "Criar Projeto".
2. **Carregar Projeto**: Selecione um projeto da lista e clique em "Carregar".
3. **Excluir Projeto**: Selecione um projeto da lista e clique em "Excluir".
4. **Editar Código**: Use o editor para modificar o código.
5. **Salvar Código**: Clique em "Salvar Código" para salvar as alterações.
6. **Compilar Código**: Clique em "Compilar Código" para compilar o código.
7. **Enviar Código**: Clique em "Enviar Código" para enviar o código para a placa Arduino.

## API

### Endpoints

- **GET /api/projects**: Lista todos os projetos disponíveis.
- **PUT /api/create_project**: Cria um novo projeto. Exige `project_name` no corpo da requisição.
- **POST /api/delete_project**: Exclui um projeto existente. Exige `project_name` no corpo da requisição.
- **GET /api/load_code**: Carrega o código de um projeto. Exige `project_name` como parâmetro de consulta.
- **POST /api/save_code**: Salva o código de um projeto. Exige `project_name` e `code` no corpo da requisição.
- **POST /api/compile_code**: Compila o código de um projeto. Exige `project_name` no corpo da requisição.
- **POST /api/upload_code**: Envia o código para a placa Arduino. Exige `project_name` no corpo da requisição.

## Contribuição

Se desejar contribuir para o projeto:

1. Fork o repositório.
2. Crie uma branch para sua feature:
    ```bash
    git checkout -b minha-nova-feature
    ```
3. Faça as mudanças necessárias e commit:
    ```bash
    git commit -am 'Adiciona nova feature'
    ```
4. Envie para o repositório remoto:
    ```bash
    git push origin minha-nova-feature
    ```
5. Abra um Pull Request.

A estrutura de projeto preferida do usuário inclui:

1. **Backend em Python/Flask** para manipulação de arquivos e interações com a CLI do Arduino.
2. **Frontend com HTML, CSS e JavaScript**, utilizando o Monaco Editor para edição de código e uma área de console para exibição de mensagens e erros.
3. **Funcionalidades principais**:
   - Criar, carregar, salvar, compilar e enviar projetos para o Arduino.
   - Atualização dinâmica da lista de projetos e exibição de mensagens no console.

A estrutura é usada para gerenciamento de projetos Arduino com integração com o Monaco Editor.

```cpp
// Declarações de variáveis e constantes
const int ledPin = 13; // O pino do LED embutido na placa Arduino

void setup() {
  // Configura o pino do LED como saída
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Acende o LED
  digitalWrite(ledPin, HIGH);
  delay(1000); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin, LOW);
  delay(1000); // Aguarda 1 segundo
}
```

### Config Editor
```bash
monaco.editor.create(document.getElementById("container"), {
    value: [
        "function hello() {",
        "\talert('Hello world!');",
        "}"
    ].join('\n'),
    language: "javascript",
    theme: "vs-dark",  // Define o tema (opcional)
    fontSize: 16,      // Tamanho da fonte
    lineNumbers: "on", // Exibe os números das linhas
    scrollBeyondLastLine: false, // Evita rolar além da última linha
    automaticLayout: true, // Ajusta automaticamente o layout do editor
    minimap: {
        enabled: false // Desativa o minimapa (opcional)
    }
});

```
