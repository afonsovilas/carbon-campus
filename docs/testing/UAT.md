# User Acceptance Tests (UAT)

This document defines manual UAT scenarios for features that already have automated acceptance tests.

## Scope

- Register
- Log Trip
- Invites
- Challenges
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
