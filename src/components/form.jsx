import CurrencySelect from "./currency-select";
import { useEffect, useState } from "react";
import { currencyCodes } from "./currency-select";
import Spinner from "./loader";


export default function Form(){

    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("VES");

    const [loading, setLoading] = useState(false);

    const [amount, setAmount] = useState("1.00");
    const [result, setResult] = useState("0.00");

    const array = currencyCodes;

    // Function to swap the currencies
    function handleSwap(){
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Function to get data
    async function getExchange(){

        setLoading(true);

        // Validate inputs
        if(!array.includes(fromCurrency) || !array.includes(toCurrency) || amount <= 0){

            return console.error("Error! Invalid currecy");
        }

        // Connect to API
        const API_KEY = import.meta.env.VITE_API_KEY;

        const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        try{

            // Get data
            const response = await fetch(url);
            const data = await response.json();

            const conversion = data.conversion_rate * amount;

            setResult(conversion.toFixed(2));

            setLoading(false);
            
        }catch(error){

            console.error(error);
            setLoading(false);
        };

    };

    // When pressing Enter on keyboard
    function handleKeyDown(e){
        
        if (e.key === 'Enter' || e.code === 'Enter'){
            handleFormSubmit();
        };
    };

    // Submit form
    function handleFormSubmit(e){
        e.preventDefault();
        if(amount <= 0){
            return console.error("Error! invalid input");
        }
        getExchange();
    };

    // When the page loads
    useEffect(()=>{
        getExchange();
    }, []);
    
    return <form className="cc-form" onSubmit={handleFormSubmit}>

        <div className="form-group">

            <div className="form-section">
                <label className="form-label">Ingrese Cantidad</label>
                <input type="number" className="form-input" step="0.01" required min="1"
                value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={handleKeyDown} />
            </div>

            <div className="currency-group">

                <div className="form-section">
                    <label className="form-label">De</label>
                    <CurrencySelect
                    selectedCurrency = {fromCurrency}
                    handleCurrency = {e => setFromCurrency(e.target.value)}
                    />
                </div>

                <div className="swap-icon" onClick={handleSwap}>
                    <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                        fill="#fff"
                        />
                    </svg>
                </div>

                <div className="form-section">
                    <label className="form-label">A</label>
                    <CurrencySelect
                    selectedCurrency = {toCurrency}
                    handleCurrency = {e => setToCurrency(e.target.value)}
                    />
                </div>

            </div>

        </div>

        <button type="submit" className="submit-btn">Convertir</button>

        {
            loading
            ? <Spinner />
            : <p className="exchange-rate-result">{amount} {fromCurrency} = {result} {toCurrency}</p>
        }

    </form>
}