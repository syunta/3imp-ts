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
        var expressionTree = this.parseFirst();
        if (this.unparsed.length != 0) {
            throw new Error(ReadErrorMessage.ExtraCloseParethesis);
        }
        return expressionTree;
    }

    protected tokenize(input: string): Array<string> {
        return input
            .replace(/\(/g, " ( ")
            .replace(/\)/g, " ) ")
            .replace(/'/g, "' ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
            .split(/\s+/);
    }

    protected parseFirst(): any {
        var token = this.takeToken();
        if (token == '(') {
            return this.parseList();
        } else if (token == "'") {
            return this.parseQuote();
        } else if (token == ".") {
            return this.parseDot(true);
        } else {
            return this.parseAtom(token);
        }
    }

    protected parseList(): any {
        if (this.unparsed[0] == ')') {
            this.takeToken();
            return null;
        } else {
            return cons(this.parseFirst(), this.parseRest());
        }
    }

    protected parseRest(): any {
        var token = this.takeToken();
        if (token == '(') {
            return cons(this.parseList(), this.parseRest());
        } else if (token == ')') {
            return null;
        } else if (token == "'") {
            return cons(this.parseQuote(), this.parseRest());
        } else if (token == ".") {
            return this.parseDot();
        } else {
            return cons(this.parseAtom(token), this.parseRest());
        }
    }

    protected parseAtom(token): any {
        if (token == "#f") { return false; }
        return parseFloat(token) || token == "#t" || Symbol.Intern(token); // TODO: support string
    }

    protected parseQuote(): any {
        var token = this.takeToken();
        if (token == '(') {
            return list(Symbol.Intern("quote"), this.parseList());
        } else {
            return list(Symbol.Intern("quote"), this.parseAtom(token));
        }
    }

    protected parseDot(calledByFirst = false): any {
        var token = this.takeToken();
        if (calledByFirst || token == ")") {
            throw new Error(ReadErrorMessage.BadDotSyntax);
        } else {
            var tail = token == "(" ? this.parseList() : this.parseAtom(token);
            if (this.takeToken() != ")") {
                throw new Error(ReadErrorMessage.BadDotSyntax);
            }
            return tail;
        }
    }

    protected takeToken() {
        if (typeof this.unparsed[0] === 'undefined') {
            throw new Error(ReadErrorMessage.EOF);
        }
        return this.unparsed.shift();
    }
}

class ReadErrorMessage { // FIXME:
    public static BadDotSyntax: string = "READ-ERROR: bad dot syntax";
    public static EOF: string = "READ-ERROR: EOF insede a list";
    public static ExtraCloseParethesis: string = "READ-ERROR: extra colse parenthesis";
}
