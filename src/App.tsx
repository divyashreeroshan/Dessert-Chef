import { useState, useEffect, useRef } from "react";

// Placeholder recipes
const recipes = [
  {
    name: "Cupcake",
    emoji: "🧁",
    steps: [
      { text: "Add 1 cup flour" },
      { text: "Add 1/2 cup sugar" },
      { text: "Crack 1 egg" },
      { text: "Stir the batter well" },
      { text: "Bake for 15 minutes" },
      { text: "Add pink frosting" }
    ],
    eggless: false
  },
  {
    name: "Pancake",
    emoji: "🥞",
    steps: [
      { text: "Add 1 cup flour" },
      { text: "Add 3/4 cup milk" },
      { text: "Add 1 egg" },
      { text: "Mix it all up until smooth" },
      { text: "Cook on pan for 2 min each side" }
    ],
    eggless: false
  },
  // New eggless recipes
  {
    name: "Eggless Choco Cake",
    emoji: "🍫🍰",
    steps: [
      { text: "Add 1 cup flour" },
      { text: "Add 1/2 cup cocoa powder" },
      { text: "Add 3/4 cup sugar" },
      { text: "Stir in 1 tsp baking soda" },
      { text: "Add 1/4 cup oil & 1 cup milk" },
      { text: "Mix to soft batter" },
      { text: "Bake for 30 minutes" },
      { text: "Decorate with sprinkles" }
    ],
    eggless: true
  },
  {
    name: "Eggless Cookie",
    emoji: "🍪",
    steps: [
      { text: "Add 1 cup flour" },
      { text: "Add 1/3 cup sugar" },
      { text: "Add 1/2 cup butter" },
      { text: "Mix in 1 tsp vanilla" },
      { text: "Add 1/4 cup choc chips" },
      { text: "Shape cookies" },
      { text: "Bake for 15 minutes" }
    ],
    eggless: true
  },
  {
    name: "Eggless Banana Muffin",
    emoji: "🍌🧁",
    steps: [
      { text: "Mash 1 ripe banana" },
      { text: "Add 3/4 cup flour" },
      { text: "Add 1/4 cup sugar" },
      { text: "Add 1 tsp baking powder" },
      { text: "Add 2 tbsp oil & 1/2 cup milk" },
      { text: "Mix to muffin batter" },
      { text: "Pour into molds & bake 20 min" }
    ],
    eggless: true
  }
];

const pastelBg = "bg-pink-100";

function App() {
  const [screen, setScreen] = useState("welcome"); // welcome, select, cook, complete
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [step, setStep] = useState(0);
  const [startTime, setStartTime] = useState(null as number | null);
  const [endTime, setEndTime] = useState(null as number | null);

  function startRecipe(recipe: any) {
    setSelectedRecipe(recipe);
    setScreen("cook");
    setStep(0);
    setStartTime(Date.now());
    setEndTime(null);
  }

  function handleStep() {
    if (selectedRecipe && step < selectedRecipe.steps.length - 1) {
      setStep(step + 1);
    } else {
      setScreen("complete");
      setEndTime(Date.now());
    }
  }

  function resetGame() {
    setScreen("welcome");
    setSelectedRecipe(null);
    setStep(0);
    setStartTime(null);
    setEndTime(null);
  }

  // Confetti animation (simple canvas stars confetti)
  function ConfettiBG() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      let animationId: number;
      const confettiColors = ["#f9c6de","#ffe8a3","#bae7e9","#e6baed"];
      let confetti: Array<{x:number,y:number,s:number,speedY:number,color:string}> = [];

      function randomConfetti() {
        return {
          x: Math.random() * (canvas?.width || 360),
          y: Math.random() * -40,
          s: 5 + Math.random() * 8,
          speedY: 1.2 + Math.random() * 1.8,
          color: confettiColors[Math.floor(Math.random()*confettiColors.length)]
        };
      }
      if (canvas && ctx) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 360*dpr;
        canvas.height = 280*dpr;
        canvas.style.width = "360px";
        canvas.style.height = "280px";
        ctx.scale(dpr, dpr);
        confetti = Array(40).fill(0).map(randomConfetti);
        function draw() {
          ctx.clearRect(0,0,360,280);
          confetti.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.s, 0, Math.PI*2);
            ctx.fillStyle = c.color;
            ctx.fill();
          });
        }
        function update() {
          confetti.forEach(c => {
            c.y += c.speedY;
            if (c.y > 280 + 10) {
              Object.assign(c, randomConfetti());
              c.y = -c.s;
            }
          });
        }
        function loop() {
          draw();
          update();
          animationId = requestAnimationFrame(loop);
        }
        loop();
        return () => cancelAnimationFrame(animationId);
      }
    }, []);
    return <canvas ref={canvasRef} className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 z-0 opacity-80" style={{width:360,height:280}} width={360} height={280} aria-hidden="true"/>;
  }

  // UI sections
  if (screen === "welcome") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pastelBg} relative overflow-hidden`}>
        <ConfettiBG />
        <div className="z-10 flex flex-col items-center animate-fadein">
          <h1 className="text-5xl font-extrabold mb-2 text-pink-600 drop-shadow animate-bounce">
            🍰<span className="mx-2">Dessert Chef!</span>🍦
          </h1>
          <p className="mb-4 text-xl text-pink-800 text-center animate-fadein2">Whisk, bake, and decorate yummy desserts.<br/>Ready to create something sweet?</p>
          <div className="flex gap-6 mb-4 mt-2">
            <span className="text-4xl rotate-3">🧁</span>
            <span className="text-4xl animate-wiggle">🍩</span>
            <span className="text-4xl -rotate-2">🍫</span>
            <span className="text-4xl animate-wiggle2">🍪</span>
            <span className="text-4xl">🍓</span>
            <span className="text-4xl rotate-1">🍨</span>
          </div>
          <button
            className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 rounded-full text-white font-bold px-12 py-4 text-2xl shadow-lg ring-2 ring-pink-200 hover:ring-pink-400 transition-all active:scale-95 animate-pulse cursor-pointer mt-4"
            onClick={() => setScreen("select")}
            tabIndex={0}
          >
            Start Cooking!
          </button>
        </div>
      </div>
    );
  }
  if (screen === "select") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pastelBg}`}>
        <h2 className="text-3xl font-bold text-pink-500 mb-6">Choose Your Recipe</h2>
        <div className="flex gap-8 flex-wrap justify-center">
          {recipes.map((r) => (
            <button
              key={r.name}
              onClick={() => startRecipe(r)}
              className={`flex flex-col items-center bg-white rounded-3xl p-6 shadow-lg border-4 ${r.eggless ? 'border-green-200 hover:border-green-400' : 'border-pink-200 hover:border-pink-400'} transition cursor-pointer w-40`}
            >
              <span className="text-6xl mb-2">{r.emoji}</span>
              <span className="text-lg font-semibold text-pink-700">{r.name}</span>
              {r.eggless && (
                <span className="mt-2 text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-semibold">Eggless</span>
              )}
            </button>
          ))}
        </div>
        <button className="mt-10 text-pink-400 underline" onClick={resetGame}>Back</button>
      </div>
    );
  }
  if (screen === "cook" && selectedRecipe) {
    const currentStep = selectedRecipe.steps[step];
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pastelBg}`}>
        <div className="bg-white rounded-2xl py-6 px-10 shadow-lg flex flex-col items-center">
          <h3 className="text-2xl font-bold text-pink-700 mb-2">
            {selectedRecipe.emoji} {selectedRecipe.name}
          </h3>
          <div className="my-8">
            <span className="text-lg font-medium text-pink-600">Step {step + 1}:</span>
            <div className="text-2xl mt-3 mb-6 text-pink-800 font-semibold min-h-[2rem]">{currentStep.text}</div>
          </div>
          <button
            className="bg-pink-400 hover:bg-pink-600 rounded-full py-3 px-8 text-xl text-white font-bold shadow transition-all"
            onClick={handleStep}
          >
            {step < selectedRecipe.steps.length - 1 ? "Do it!" : "Finish!"}
          </button>
        </div>
      </div>
    );
  }
  if (screen === "complete" && selectedRecipe) {
    const timeTaken = startTime && endTime ? Math.round((endTime - startTime) / 1000) : null;
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pastelBg}`}>
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-pink-200 shadow-lg border-2 border-pink-200">
          <div className="text-6xl mb-2">{selectedRecipe.emoji}</div>
          <h4 className="text-2xl text-pink-600 font-bold mb-4">Done!</h4>
          <div className="mb-2 text-lg">You finished the <span className="font-semibold text-pink-500">{selectedRecipe.name}</span> recipe! 🎉</div>
          {timeTaken !== null && (
            <div className="mb-2 italic text-pink-700">Time: {timeTaken} seconds</div>
          )}
          <button
            className="mt-6 bg-pink-400 hover:bg-pink-600 rounded-full py-3 px-8 text-xl text-white font-bold shadow transition-all"
            onClick={resetGame}
          >
            Cook Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}

export default App;

/*
Tailwind custom animations:
.animate-fadein {
  animation: fadein 900ms ease;
}
@keyframes fadein {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadein2{
  animation: fadein 1700ms ease;
}
@keyframes wiggle {
  0%, 100% { transform: rotate(-9deg);}
  50% { transform: rotate(8deg);}
}
@keyframes wiggle2 {
  0%,100% {transform: rotate(7deg);}
  50% {transform: rotate(-7deg);}
}
.animate-wiggle {
  animation: wiggle 1.3s infinite ease-in-out;
}
.animate-wiggle2 {
  animation: wiggle2 1.1s infinite ease-in-out;
}
*/
