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

    constructor(name: string) {
        this.name = name;
    }

    public name: string;

    public static Intern(key: string): Symbol {
        if (!Symbol.table[key]) {
            Symbol.table[key] = new Symbol(key);
        }
        return Symbol.table[key];
    }
}

class Parser {
    protected unparsed: Array<string>;

    public parse(input: string): any {
        this.unparsed = this.tokenize(input);
        return this.parseFirst();
    }

    public tokenize(input: string): Array<string> {
        return input
            .replace(/\(/g, " ( ")
            .replace(/\)/g, " ) ")
            .replace(/'/g, "' ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .split(/\s+/);
    }

    protected parseFirst(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return this.parseApplication();
        } else if (token == "'") {
            return this.parseQuote();
        } else {
            return this.parseObject(token);
        }
    }

    protected parseApplication(): any {
        return cons(this.parseFirst(), this.parseRest());
    }

    protected parseRest(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return cons(this.parseApplication(), this.parseRest());
        } else if (token == ')') {
            return null;
        } else if (token == "'") {
            return cons(this.parseQuote(), this.parseRest());
        } else {
            return cons(this.parseObject(token), this.parseRest());
        }
    }

    protected parseObject(token): any {
        return this.parseAtom(token); // TODO: Support dot, application
    }

    protected parseAtom(token): any {
        return parseFloat(token) || Symbol.Intern(token);
    }

    protected parseQuote(): any {
        var token = this.unparsed.shift();

        if (token == '(') {
            return list(Symbol.Intern("quote"), this.parseApplication());
        } else {
            return list(Symbol.Intern("quote"), this.parseObject(token));
        }
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
    var parsed3 = parser.parse("'+"); // (quote +)
    var parsed4 = parser.parse("'(+ + +)"); // (quote (+ + +))
    var parsed5 = parser.parse("(proc '(+) *)"); // (proc (quote (+)) *)
    var parsed6 = parser.parse("('proc + *)"); // ((quote proc) + *)
    var parsed7 = parser.parse("('(proc) + *)"); // ((quote (proc)) + *)
};