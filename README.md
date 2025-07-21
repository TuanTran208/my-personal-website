# My personal Website
Learn how to build website
Naming Connvention: Eslint-Parser

Folder Structure Suggestion: Nuxt
https://nuxt.com/docs/4.x/guide/directory-structure
### Run the Full Application 🚀

You need to run both the backend and frontend servers at the same time. This requires two separate Command Prompt windows.

1. **Start the Backend Server**:
    - Open a Command Prompt in the `my-secure-site/backend` folder.
    - Run the command:
    ```Bash
        npm install
        node server.js
    ```
    - You should see `🚀 Backend server running at http://localhost:3000`.
2. **Start the Frontend Server**:
    - Open a **new** Command Prompt in the `my-secure-site/frontend` folder.
    - Run the command:
   ```Bash
        npm install
        npm run serve
   ```

    - Wait for it to compile. You will see a message with a link, usually `http://localhost:8080/`.
3. **View Your Website**: Open your web browser and go to `http://localhost:8080`. You will see your Vue app with the download button. Click it, and your browser will securely download the file from your backend!