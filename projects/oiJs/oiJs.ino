void setup() {
  Serial.begin(9600); // Inicia a comunicação serial a 9600 bps
}

void loop() {
  if (Serial.available() > 0) {
    char receivedChar = Serial.read(); // Lê o caractere recebido
    
    if (receivedChar == 'A') {
      Serial.println("Ah, claro, você digitou 'A'. O que mais você tem de surpreendente para me mostrar?");
    }
  }
}
