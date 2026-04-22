# Firebase Setup (Firestore)

Integração já preparada no código:

- [services/firebase.ts](services/firebase.ts)
- [services/trips.service.ts](services/trips.service.ts)
- [contexts/TripsContext.tsx](contexts/TripsContext.tsx)

## Opção A: Configuração rápida no Console (test mode temporário)

1. Abrir o projeto no Firebase Console.
2. Clicar no menu lateral e ir a Build > Firestore Database.
3. Clicar em Create database.
4. Escolher Start in test mode.
5. Selecionar região.

Regras usadas neste modo (temporárias):

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read, write: if true;
    }
  }
}
```

## Opção B: Firebase Emulator Suite (recomendado para desenvolvimento)

Pré-requisitos:

- Node.js instalado
- Java JDK instalado

Passos:

1. Login no Firebase CLI:

```bash
npm run firebase:login
```

2. Inicializar ligação do projeto local ao Firebase (uma vez):

```bash
npm run firebase:init
```

3. Iniciar emulador do Firestore:

```bash
npm run firebase:emulators
```

4. Alternativa com persistência de dados do emulador:

```bash
npm run firebase:emulators:import
```

5. UI dos emuladores:

- http://127.0.0.1:4000

## Variáveis de ambiente

1. Copiar `.env.example` para `.env`.
2. Preencher credenciais Firebase (Web App):

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

3. Para usar emulador no app:

- `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true`
- `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1`
- `EXPO_PUBLIC_FIREBASE_EMULATOR_PORT=8080`

Depois, reiniciar o Expo completamente:

```bash
npm run start
```

## Fluxo de dados no app

- Ao registar viagem, a app atualiza estado local e tenta guardar em Firestore.
- Ao iniciar, a app tenta carregar viagens de Firestore.
- Se credenciais Firebase não estiverem definidas, a app continua em modo local.
