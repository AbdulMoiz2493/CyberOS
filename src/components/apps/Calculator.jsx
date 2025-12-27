import { useState } from "react";
import { useOSStore } from "../../store/osStore";

const Calculator = () => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState([]);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + " " + op + " ");
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      const result = eval(fullEquation.replace(/×/g, "*").replace(/÷/g, "/"));
      const roundedResult = Math.round(result * 1000000000) / 1000000000;
      setHistory([...history, { equation: fullEquation, result: roundedResult }]);
      setDisplay(String(roundedResult));
      setEquation("");
      setIsNewNumber(true);
    } catch {
      setDisplay("Error");
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setIsNewNumber(true);
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  const handleNegate = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleSquareRoot = () => {
    setDisplay(String(Math.sqrt(parseFloat(display))));
    setIsNewNumber(true);
  };

  const handleSquare = () => {
    setDisplay(String(Math.pow(parseFloat(display), 2)));
    setIsNewNumber(true);
  };

  const handleReciprocal = () => {
    setDisplay(String(1 / parseFloat(display)));
    setIsNewNumber(true);
  };

  const Button = ({ children, onClick, className = "", span = 1 }) => (
    <button
      className={`p-4 rounded-lg text-lg font-medium transition-colors ${className}`}
      style={{ gridColumn: `span ${span}` }}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const funcBtnClass = isLight ? 'bg-black/5 hover:bg-black/10 text-black/80' : 'bg-white/5 hover:bg-white/10 text-white/80';
  const numBtnClass = isLight ? 'bg-black/10 hover:bg-black/15 text-black' : 'bg-white/10 hover:bg-white/15 text-white';
  const opBtnClass = isLight ? 'bg-black/5 hover:bg-black/10 text-os-primary' : 'bg-white/5 hover:bg-white/10 text-os-primary';

  return (
    <div className={`h-full flex flex-col p-4 ${isLight ? 'bg-gray-50' : 'bg-os-surface'}`}>
      {/* Display */}
      <div className="mb-4">
        <div className={`text-right text-sm h-6 overflow-hidden ${isLight ? 'text-black/40' : 'text-white/40'}`}>
          {equation}
        </div>
        <div className={`text-right text-4xl font-light overflow-hidden ${isLight ? 'text-black' : 'text-white'}`}>
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <Button onClick={handlePercent} className={funcBtnClass}>%</Button>
        <Button onClick={handleClearEntry} className={funcBtnClass}>CE</Button>
        <Button onClick={handleClear} className={funcBtnClass}>C</Button>
        <Button onClick={handleBackspace} className={funcBtnClass}>⌫</Button>

        <Button onClick={handleReciprocal} className={funcBtnClass}>1/x</Button>
        <Button onClick={handleSquare} className={funcBtnClass}>x²</Button>
        <Button onClick={handleSquareRoot} className={funcBtnClass}>√</Button>
        <Button onClick={() => handleOperator("÷")} className={opBtnClass}>÷</Button>

        <Button onClick={() => handleNumber("7")} className={numBtnClass}>7</Button>
        <Button onClick={() => handleNumber("8")} className={numBtnClass}>8</Button>
        <Button onClick={() => handleNumber("9")} className={numBtnClass}>9</Button>
        <Button onClick={() => handleOperator("×")} className={opBtnClass}>×</Button>

        <Button onClick={() => handleNumber("4")} className={numBtnClass}>4</Button>
        <Button onClick={() => handleNumber("5")} className={numBtnClass}>5</Button>
        <Button onClick={() => handleNumber("6")} className={numBtnClass}>6</Button>
        <Button onClick={() => handleOperator("-")} className={opBtnClass}>−</Button>

        <Button onClick={() => handleNumber("1")} className={numBtnClass}>1</Button>
        <Button onClick={() => handleNumber("2")} className={numBtnClass}>2</Button>
        <Button onClick={() => handleNumber("3")} className={numBtnClass}>3</Button>
        <Button onClick={() => handleOperator("+")} className={opBtnClass}>+</Button>

        <Button onClick={handleNegate} className={numBtnClass}>±</Button>
        <Button onClick={() => handleNumber("0")} className={numBtnClass}>0</Button>
        <Button onClick={handleDecimal} className={numBtnClass}>.</Button>
        <Button onClick={handleEquals} className="bg-os-primary hover:bg-os-primary/80 text-white">=</Button>
      </div>
    </div>
  );
};

export default Calculator;
