# User Acceptance Tests (UAT)

This document defines manual UAT scenarios for features that already have automated acceptance tests.

## Scope

- App bootstrap redirect
- Login
- Register
- Home dashboard
- Log Trip
- Register Trip confirmation screen
- Rewards screen
- Invites
- Challenges
- History
- Rankings (locked state)

## Execution Info

- Environment: Expo app (Android, iOS, Web)
- Build: latest `main`/feature branch under validation
- Tester role: end user/student
- Evidence: screenshot or short video per scenario

## UAT Scenarios

### UAT-REG-01: Successful registration

- Precondition: user is on register screen
- Steps:
1. Fill Email with `up202012345@fe.up.pt`
2. Fill Password with `password123`
3. Fill Confirm Password with `password123`
4. Tap Registar
- Expected results:
1. Success alert appears with message "Conta criada com sucesso!"
2. Tapping OK navigates to tabs area

### UAT-REG-02: Registration validation errors

- Precondition: user is on register screen
- Steps:
1. Leave one field empty and tap Registar
2. Fill mismatching passwords and tap Registar
3. Use email `duplicado@teste.pt` with matching passwords and tap Registar
- Expected results:
1. Empty fields: alert "Preenche todos os campos"
2. Mismatch: alert "As passwords não coincidem"
3. Duplicate: alert "Email já registado"

### UAT-LOGIN-01: Successful login

- Precondition: user is on login screen
- Steps:
1. Fill Email with `teste@up.pt`
2. Fill Password with `1234`
3. Tap Entrar
- Expected results:
1. App navigates to tabs area

### UAT-LOGIN-02: Login validation errors

- Precondition: user is on login screen
- Steps:
1. Tap Entrar with empty fields
2. Fill invalid credentials and tap Entrar
- Expected results:
1. Empty fields: alert "Preenche todos os campos"
2. Invalid credentials: alert "Email ou password incorretos"

### UAT-HOME-01: Dashboard navigation actions

- Precondition: user is in home tab
- Steps:
1. Tap "Registar Viagem"
2. Return to home and tap "Ranking"
- Expected results:
1. First action opens LogTrip screen
2. Second action opens Rankings screen

### UAT-LOG-01: Successful trip logging

- Precondition: user is on LogTrip screen
- Steps:
1. Choose a transport mode
2. Enter distance `5`
3. Tap Save Trip
- Expected results:
1. Save button is enabled before tap
2. Success message "Trip logged successfully!" appears
3. Inputs are reset

### UAT-LOG-02: Invalid distance handling

- Precondition: user is on LogTrip screen
- Steps:
1. Enter distance `-2` and do not select transport
2. Tap Save Trip
- Expected results:
1. Save button remains disabled or submit does not proceed
2. Validation message "Please enter a valid distance greater than 0" appears

### UAT-HIS-01: History state by trip availability

- Precondition: user is in history tab
- Steps:
1. Open history before logging any trip
2. Log one trip
3. Return to history
- Expected results:
1. Before logging: message "Nenhuma viagem registada ainda"
2. After logging: list includes new trip with mode, distance, points, and date

### UAT-INV-01: Invite request success

- Precondition: user is on invites screen
- Steps:
1. Enter `user1` in search
2. Tap search button
3. Tap Send Request
- Expected results:
1. User card for User1 appears
2. Button changes to Pending and becomes disabled

### UAT-INV-02: Invite search error

- Precondition: user is on invites screen
- Steps:
1. Enter `unknown_user`
2. Tap search button
- Expected results:
1. Error text "Username does not exist" appears

### UAT-CH-01: Create challenge and invite friend

- Precondition: user is on challenges screen
- Steps:
1. Fill challenge name + start + end dates
2. Tap Create Challenge
3. Tap invite button on created challenge
4. Search `user1`
5. Tap Invite
- Expected results:
1. Challenge appears in active list
2. Invite panel opens with correct challenge name
3. Success alert confirms invite sent

### UAT-REWARD-01: Reward blocked without station validation

- Precondition: user is outside station area or location unavailable
- Steps:
1. Open rewards screen
- Expected results:
1. Reward remains visually blocked
2. User sees guidance to move closer to the station

### UAT-REWARD-02: Reward QR generation at station

- Precondition: user is within allowed station radius and has points
- Steps:
1. Open rewards screen
2. Tap "Obter Código QR"
- Expected results:
1. QR code is generated and displayed
2. Points are reduced by reward cost

### UAT-REGTRIP-01: Register trip confirmation screen behavior

- Precondition: user is on register-trip screen
- Steps:
1. Tap "CONFIRMAR REGISTO"
- Expected results:
1. Confirmation alert appears
2. App navigates back to previous screen

### UAT-BOOT-01: Initial redirect

- Precondition: app freshly launched
- Steps:
1. Open app root route
- Expected results:
1. App redirects to login screen

### UAT-RANK-01: Locked ranking state

- Precondition: user has no trips
- Steps:
1. Open rankings screen
2. Tap Registar 1a Viagem
- Expected results:
1. Locked title and description are visible
2. App navigates to LogTrip screen

## Exit Criteria

- All UAT scenarios executed
- No open critical defects
- All medium defects either fixed or accepted with workaround
