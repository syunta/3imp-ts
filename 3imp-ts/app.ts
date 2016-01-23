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

function cdr<TCar, TCdr>(cell: Cell<TCar, TCdr>) {
    return cell.cdr;
}

function cons<TCar, TCdr>(car: TCar, cdr: TCdr) {
    return new Cell(car, cdr);
}

function cadr<TCar1, TCar2, TCdr>(cell: Cell<TCar1, Cell<TCar2, TCdr>>) {
    return car(cdr(cell));
}

window.onload = () => {
    var el = window.document.getElementById('content');
    var cell = cons(1, cons(cons("hoge", 10), 3));
    el.innerHTML += car(cell);
    el.innerHTML += cadr(cell).car;
};