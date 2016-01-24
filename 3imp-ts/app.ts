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

function cddr<TCar1, TCar2, TCdr>(cell: Cell<TCar1, Cell<TCar2, TCdr>>) {
    return cdr(cdr(cell));
}

function list<T>(e: T): Cell<T, void>;
function list<T1, T2>(e1: T1, e2: T2): Cell<T1, Cell<T2, void>>;
function list<T1, T2, T3>(e1: T1, e2: T2, e3: T3): Cell<T1, Cell<T2, Cell<T3, void>>>;
function list<T1, T2, T3, T4>(e1: T1, e2: T2, e3: T3, e4: T4): Cell<T1, Cell<T2, Cell<T3, Cell<T4, void>>>>;
function list(...args: any[]) {
    return args.reverse().reduce((prev, current) => cons(current, prev), null);
}

class Symbol extends String { }

window.onload = () => {
    var el = window.document.getElementById('content');
    var cell = cons(1, cons(cons("hoge", 10), 3));
    el.innerHTML += car(cell);
    el.innerHTML += cadr(cell).car;
    el.innerHTML += cell.cdr.car.cdr;
    el.innerHTML += cddr(cell);

    var lst = list(1, "hoge", 3);
    el.innerHTML += car(lst);
    el.innerHTML += cadr(lst);
    el.innerHTML += cddr(lst).car;
    el.innerHTML += cddr(lst).cdr;

    var s = new Symbol();
    el.innerHTML += s instanceof Symbol;
    el.innerHTML += s instanceof Cell;
};