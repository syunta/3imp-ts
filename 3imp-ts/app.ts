/// <reference path = "Scripts/linq" />
import IEnumerable = linqjs.IEnumerable;

class Cell {
    public car: any;
    public cdr: any;

    constructor(car: any, cdr: any) {
        this.car = car;
        this.cdr = cdr;
    }
}

function car(cell: Cell): any {
    return cell.car;
}

function cdr(cell: Cell): any {
    return cell.cdr;
}

function cons(car: any, cdr: any): Cell {
    return new Cell(car, cdr);
}

function cadr(cell: Cell): any {
    return car(cdr(cell));
}

function cddr(cell: Cell): any {
    return cdr(cdr(cell));
}

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

    public static Intern(key: string): Symbol {
        if (!Symbol.table[key]) {
            Symbol.table[key] = new Symbol();
        }
        return Symbol.table[key];
    }
}

class Parser {
    protected unparsed: Array<string>;

    public parse(input: string): any {
        this.unparsed = this.tokenize(input);
        return this.parseSentence();
    }

    public tokenize(input: string): Array<string> {
        return input
            .replace(/\(/g, " ( ")
            .replace(/\)/g, " ) ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .split(/\s+/);
    }

    public parseSentence(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return this.parseApplication();
        } else {
            return this.parseObject(token);
        }
    }

    public parseApplication(): any {
        return cons(this.parseOperator(), this.parseOperands());
    }

    public parseOperator(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return this.parseApplication();
        } else {
            return this.parseObject(token);
        }
    }

    public parseOperands(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return cons(this.parseApplication(), this.parseOperands());
        } else if (token == ')') {
            return null;
        } else {
            return cons(this.parseObject(token), this.parseOperands());
        }
    }

    public parseObject(token): any {
        return this.parseAtom(token); // TODO: Support quote, dot
    }

    public parseAtom(token): any {
        return  parseFloat(token) || Symbol.Intern(token);
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

    var s1 = Symbol.Intern('hoge');
    el.innerHTML += s1 instanceof Symbol;
    el.innerHTML += s1 instanceof Cell;
    var s2 = Symbol.Intern('hoge');
    var s3 = Symbol.Intern('foo');
    el.innerHTML += s1 == s2;
    el.innerHTML += s1 == s3;

    var parser = new Parser();
    var tokens = parser.tokenize("  (cons 1 (cons 2 (cons 3 '())))");
    el.innerHTML += "<br />";
    el.innerHTML += tokens;

    var parsed = parser.parse("(+ (+ 1 2) 3)");
    var parsed2 = parser.parse("1");
};