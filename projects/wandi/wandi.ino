// Código em C para Arduino: Explore a programação no Arduino de maneira divertida e educativa com a Causa-Efeito, SINER.

void setup() {
      // Inicializa a comunicação serial
      Serial.begin(9600);
  }
  
  void loop() {
      // Imprime uma mensagem especial pela porta serial
      Serial.println("Oi, Wandi! Bem-vindo ao universo do Arduino com a Causa-Efeito, SINER!");
      
      // Aguarda um momento antes da próxima aventura
      delay(1000);
  }