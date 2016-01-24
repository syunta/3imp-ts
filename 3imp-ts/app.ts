/// <reference path = "Scripts/linq" />
import IEnumerable = linqjs.IEnumerable;

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
    return args
        .reverse()
        .reduce((prev, current) => cons(current, prev), null);
}

class Dictionary<T> {
    [index: string]: T;
}

class Symbol {
    protected static table: Dictionary<Symbol> = new Dictionary<Symbol>();

    public static Generate(key: string): Symbol {
        if (!Symbol.table[key]) {
            Symbol.table[key] = new Symbol();
        }
        return Symbol.table[key];
    }
}

class Parser {
    public tokenize(input: string): Array<string> {
        return input
            .replace(/\(/g, " ( ")
            .replace(/\)/g, " ) ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .split(/\s+/);
    }

    public parseAtom(token: string) {
        return  parseFloat(token) || Symbol.Generate(token);
    }
}

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

    var s1 = Symbol.Generate('hoge');
    el.innerHTML += s1 instanceof Symbol;
    el.innerHTML += s1 instanceof Cell;
    var s2 = Symbol.Generate('hoge');
    var s3 = Symbol.Generate('foo');
    el.innerHTML += s1 == s2;
    el.innerHTML += s1 == s3;

    var parser = new Parser();
    var tokens = parser.tokenize("  (cons 1 (cons 2 (cons 3 '())))");
    el.innerHTML += "<br />";
    el.innerHTML += tokens;

    el.innerHTML += parser.parseAtom("1");
    el.innerHTML += parser.parseAtom("1.99");
    el.innerHTML += parser.parseAtom("cons");
};