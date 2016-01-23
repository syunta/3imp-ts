class Cell<TCar, TCdr> {
    public car: TCar;
    public cdr: TCdr;

    constructor(car: TCar, cdr: TCdr) {
        this.car = car;
        this.cdr = cdr;
    }
}

function car<TCar, TCdr>(cell: Cell<TCar, TCdr>) {
    return cell.car;
}

window.onload = () => {
    var el = window.document.getElementById('content');
    var cell = cons(1, cons(cons("hoge", 10), 3));
    el.innerHTML += car(cell);
};