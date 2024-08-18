String messages[] = {"Hello, Unity!", "Message 2", "Message 1", "Message 3", "Another Message"};
int messagesCount = 5;

void setup() {
  Serial.begin(9600); // Inicia a comunica��o serial na taxa de 9600 bps
}

void loop() {
  int randomIndex = random(messagesCount); // Escolhe um �ndice aleat�rio
  String message = messages[randomIndex]; // Seleciona uma mensagem aleat�ria
  Serial.println(message); // Envia a mensagem pela porta serial
  delay(1000); // Espera 1 segundo antes de enviar a pr�xima mensagem
}
