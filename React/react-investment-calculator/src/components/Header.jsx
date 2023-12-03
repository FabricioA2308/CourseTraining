import calculatorLogo from "../assets/investment-calculator-logo.png";

export default function Header() {
  return (
    <header id="header">
        <img src={calculatorLogo}></img>
        <h1>Investment Calculator</h1>
    </header>
  );
}
