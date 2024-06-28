import spinner from "/spinner.svg";

export default function Spinner(){

    return <div className="loading">
        <img src={spinner} alt="Spinner" />
    </div>
}