# Arduino Project Manager

Esta aplicação web permite gerenciar projetos Arduino, oferecendo funcionalidades para criar, editar, compilar e enviar sketches para uma placa Arduino. A interface é simples e intuitiva, com um editor de código integrado e fácil de usar.

## Funcionalidades

- **Criação de Projetos**: Cria uma nova pasta para o projeto com o mesmo nome do arquivo `.ino`.
- **Listagem de Projetos**: Exibe todos os projetos existentes.
- **Carregamento de Código**: Permite carregar o código `.ino` de um projeto existente.
- **Edição de Código**: Integra o Monaco Editor para edição avançada do código Arduino.
- **Salvamento de Código**: Salva as alterações feitas no código de um projeto.
- **Compilação**: Compila o código `.ino` usando a CLI do Arduino.
- **Upload**: Envia o código compilado para uma placa Arduino conectada.
- **Detecção Automática de Porta**: Detecta automaticamente a porta serial em que a placa Arduino está conectada.

## Estrutura do Projeto

### Backend (Python/Flask)

- **Funções principais**:
  - **Criação de Projetos**: Cria uma pasta para o projeto com o mesmo nome do sketch `.ino`.
  - **Listagem de Projetos**: Lista todos os projetos existentes no diretório.
  - **Carregamento de Código**: Carrega o código `.ino` de um projeto para ser editado.
  - **Salvamento de Código**: Salva as alterações feitas no código de um projeto.
  - **Compilação**: Compila o código `.ino` usando a CLI do Arduino.
  - **Upload**: Envia o código compilado para uma placa Arduino conectada.
  - **Detecção de Porta**: Identifica a porta serial em que a placa Arduino está conectada.

### Frontend (HTML/CSS/JavaScript)

- **Interface do Usuário**:
  - **Monaco Editor**: Editor de código integrado para facilitar a edição do sketch Arduino com suporte à linguagem C++.
  - **Painéis de Controle**:
    - **Criar Novo Projeto**: Entrada para o nome do projeto e botão para criar.
    - **Projetos Disponíveis**: Lista de projetos existentes.
    - **Carregar Projeto**: Entrada para nome do projeto e botões para carregar ou excluir o projeto.
    - **Editor de Código**: Área para edição do código com o Monaco Editor.
    - **Botões de Ação**: Salvar, Compilar, e Enviar código.
- **Comunicação com Backend**: As ações no frontend enviam requisições para o backend através de `fetch` para interações como criar, carregar, salvar, compilar e enviar o código.

## Fluxo de Trabalho

1. **Criar um Projeto**:
   - Insira o nome do projeto e clique em "Criar Projeto".
   - Uma pasta com o nome do projeto será criada, contendo um arquivo `.ino` básico.

2. **Carregar um Projeto**:
   - Selecione um projeto existente e clique em "Carregar".
   - O código será carregado no Monaco Editor para edição.

3. **Editar o Código**:
   - Escreva ou edite o código no Monaco Editor.

4. **Salvar o Código**:
   - Após editar, clique em "Salvar Código" para persistir as alterações.

5. **Compilar o Código**:
   - Clique em "Compilar Código" para compilar o sketch. O resultado da compilação será exibido.

6. **Enviar para a Placa**:
   - Clique em "Enviar Código" para fazer o upload do código compilado para a placa Arduino conectada.

## Requisitos

- Python 3.x
- Flask
- Arduino CLI

## Como Executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/yourusername/arduino-project-manager.git
