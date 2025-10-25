## Objective: 
Create a Playwright-driven test suite that leverages data-driven techniques to minimize code duplication and improve scalability. By driving test scenarios from a JSON object, we can dynamically adapt each test case without repeating code, ensuring a clean and maintainable structure as new cases are added. Only TypeScript is used.
[Link to the assignment.](https://docs.google.com/document/d/1oGwPbnNImNIlEkwdMcBCUhgQEPclkDss8iFZP2A8AQ0/edit?tab=t.0)

## Project setup steps:
1. Initialize the project

npm init -y

npm install -D @playwright/test @types/node typescript

npx playwright install

npm install -D dotenv

2. Create .env file in the root

3. Add credentials to .env file (see .env.example)

TEST_USERNAME=[write username here without brackets]

TEST_PASSWORD=[write password here without brackets]

4. Run tests
npm test
