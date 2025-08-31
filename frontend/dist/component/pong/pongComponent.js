import dom from "../../shared/dom.js";
function pongComponent(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const container = dom.create(`
    <div class="justify-items-center relative">
      <canvas data-id="pong-canvas" class="bg-accentColour border-[16px] border-lightText rounded-10 w-full"></canvas>
    </div>
  `);
    const canvas = container.querySelector('[data-id="pong-canvas"]');
    const context = canvas.getContext("2d");
    // Set canvas dimensions
    canvas.width = props.width;
    canvas.height = props.height;
    // Create alias input overlay
    const aliasOverlay = dom.create(`
    <div data-id="alias-overlay" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-5 rounded">
      <div class="text-xl mb-4">Enter tournament alias</div>
      <input 
        data-id="alias-input"
        type="text" 
        class="w-64 px-4 py-2 mb-4 text-black text-center rounded" 
        maxlength="12"
      >
      <div class="mb-4">Time left: <span data-id="countdown">10</span>s</div>
      <button data-id="submit-alias" class="px-4 py-2 bg-cyan-700 rounded">Submit</button>
    </div>
  `);
    container.appendChild(aliasOverlay);
    const aliasInput = aliasOverlay.querySelector('[data-id="alias-input"]');
    const countdownDisplay = aliasOverlay.querySelector('[data-id="countdown"]');
    const submitButton = aliasOverlay.querySelector('[data-id="submit-alias"]');
    // Normalized dimensions from config
    const ballRadiusNormalized = ((_b = (_a = props.config) === null || _a === void 0 ? void 0 : _a.ball) === null || _b === void 0 ? void 0 : _b.radius) || 0.02;
    const paddleHeightNormalized = ((_d = (_c = props.config) === null || _c === void 0 ? void 0 : _c.paddle) === null || _d === void 0 ? void 0 : _d.height) || 0.2;
    const paddleWidthNormalized = ((_f = (_e = props.config) === null || _e === void 0 ? void 0 : _e.paddle) === null || _f === void 0 ? void 0 : _f.width) || 0.02;
    const separationLineWidthNormalized = ((_h = (_g = props.config) === null || _g === void 0 ? void 0 : _g.net) === null || _h === void 0 ? void 0 : _h.width) || 0.01;
    // Current state
    let state = {
        ball: { x: 0.5, y: 0.5 },
        paddles: [{ y: 0.5 }, { y: 0.5 }]
    };
    // Convert normalized to pixel values
    const getPixelValues = () => ({
        ballRadius: ballRadiusNormalized * Math.min(canvas.width, canvas.height),
        paddleHeight: paddleHeightNormalized * canvas.height,
        paddleWidth: paddleWidthNormalized * canvas.width,
        separationLineWidth: separationLineWidthNormalized * canvas.width
    });
    // Drawing functions
    const drawPaddle = (x, centerY, paddleWidth, paddleHeight) => {
        context.fillRect(x, centerY - paddleHeight / 2, paddleWidth, paddleHeight);
    };
    const drawBall = (x, y, radius) => {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = "#8f97de";
        context.fill();
        context.lineWidth = 10; // Breite des Randes
        context.strokeStyle = "#8f97de"; // Farbe des Randes (z.B. Orange/Pong-Farbe)
        context.stroke();
    };
    const drawScene = () => {
        const { ballRadius, paddleHeight, paddleWidth, separationLineWidth } = getPixelValues();
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#f8f8f8";
        // Draw paddles
        drawPaddle(0, state.paddles[0].y * canvas.height, paddleWidth, paddleHeight);
        drawPaddle(canvas.width - paddleWidth, state.paddles[1].y * canvas.height, paddleWidth, paddleHeight);
        // Draw center line
        context.fillRect((canvas.width / 2) - (separationLineWidth / 2), 0, separationLineWidth, canvas.height);
        // Draw ball
        drawBall(state.ball.x * canvas.width, state.ball.y * canvas.height, ballRadius);
    };
    // Draw overlay text (generalized countdown)
    const drawOverlayText = (text) => {
        context.fillStyle = "#3d447a";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        const fontSize = canvas.height * 0.15; // 15% of canvas height
        context.font = `${fontSize}px Quicksand`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);
    };
    const clearOverlayText = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawScene();
    };
    // Show alias input on canvas
    const showAliasInput = (defaultAlias, onSubmit, timeoutSeconds) => {
        aliasInput.value = defaultAlias;
        aliasOverlay.classList.remove("hidden");
        let secondsLeft = timeoutSeconds;
        countdownDisplay.textContent = secondsLeft.toString();
        // Start countdown
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            countdownDisplay.textContent = secondsLeft.toString();
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                handleAliasSubmit();
            }
        }, 1000);
        // Submit handler
        const handleAliasSubmit = () => {
            clearInterval(countdownInterval);
            aliasOverlay.classList.add("hidden");
            onSubmit(aliasInput.value);
        };
        // Event listeners
        const submitHandler = () => handleAliasSubmit();
        const keyHandler = (e) => {
            if (e.key === "Enter") {
                handleAliasSubmit();
            }
        };
        submitButton.addEventListener("click", submitHandler);
        aliasInput.addEventListener("keydown", keyHandler);
        // Focus input immediately
        setTimeout(() => aliasInput.focus(), 100);
        // Cleanup function
        return () => {
            clearInterval(countdownInterval);
            submitButton.removeEventListener("click", submitHandler);
            aliasInput.removeEventListener("keydown", keyHandler);
        };
    };
    // Handle window resize
    const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = newWidth * (9 / 16);
        canvas.width = newWidth;
        canvas.height = newHeight;
        drawScene();
    };
    window.addEventListener("resize", handleResize);
    // Initial draw
    drawScene();
    return {
        element: container,
        update: (newState) => {
            state = Object.assign(Object.assign({}, state), newState);
            drawScene();
        },
        drawOverlayText,
        clearOverlayText,
        showAliasInput
    };
}
export default pongComponent;
