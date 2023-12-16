# web-rtc-demo-2
WebRTC Demo 2, created after Demo 1 failed

Following the Youtube tutorial: https://www.youtube.com/watch?v=5M3Jzs2NFSA

To setup, please run npm install in the frontend as well as the backend directories
To run, please navigate to the main directory (web-rtc-demo-2) and run "bash scripts/start.sh". To access the web app, you need to use https://localhost:5000/ or https://127.0.0.1:5000/, note the https protocol, generally http is used for development.

For the manual method, use the code commit (main branch) titled "manual method" (15.12.23), or simply use the "manual-method" branch, and follow these steps:

1. Open two tabs (you may also do this on different laptops, either on same or different networks)
2. Tab 1: Create offer (click on button), copy the SDP offer from console
3. Tab 2: Paste the copied offer from Tab 1 in the text box and click on "Set Remote Description"
4. Tab 2: Create answer (button) and copy the resulting SDP answer from the console
5. Tab 1: Paste the answer and set the remote description
6. Tab 1: Copy the first ICE candidate (amongst a couple other few) that was generated when we clicked on "Create Offer" (step 2)
7. Tab 2: Clear the text box and paste the ICE candidate and click on "Add ICE Candidate"

Notes:

In step 7, either of the two clients can add the ICE candidates, but only one needs to do it. So, alternatively, 

6. Tab 2: Copy the first ICE candidate (amongst a couple other few) that was generated when we clicked on "Create Answer" (step 4)
7. Tab 1: Clear the text box and paste the ICE candidate and click on "Add ICE Candidate"

For the automated method, use the code commit titled "automated the whole copy pasting process" (16.12.23) and follow these steps:

1. Open two tabs
2. Tab 1: Create Offer
3. Tab 2: Set Remote Description
4. Tab 2: Create Answer
5. Tab 1: Set Remote Description
6. Tab 1: Add ICE Cadidate