/// <reference path = "../app" />

describe('Cell class', () => {
    describe('creates instance', () => {
        var numberCell = new Cell(1, 2),
            stringCell = new Cell("hoge", "hoge"),
            singletonList = new Cell(1, null),
            list = new Cell(1, new Cell(2, null));

        it('has car', () => { expect(numberCell.car).toBe(1); });
        it('has cdr', () => { expect(numberCell.cdr).toBe(2); });

        it('has value of any type', () => {
            expect(stringCell.car).toEqual(jasmine.any(String));
            expect(numberCell.car).toEqual(jasmine.any(Number));
            expect(singletonList.cdr).toBe(null)
            expect(list.cdr).toEqual(jasmine.any(Cell));
        });
    });
});

describe('Premitive procedures for sequence operation:', () => {
    it("The 'cons' constructs a cell", () => {
        expect(cons(1, 2)).toEqual(new Cell(1, 2));
    });

    it("The 'list' constructs a nested cons cells", () => {
        expect(list(1, 'hoge', 3)).toEqual(cons(1, cons('hoge', cons(3, null))));
    });

    var seq = list(1, cons('hoge', 10), 3);

    it("The 'car' refers car of cell", () => { expect(car(seq)).toBe(1); });
    it("The 'cdr' refers cdr of cell", () => { expect(cdr(seq)).toBe(seq.cdr); });
    it("The 'cadr' works car then cdr", () => { expect(cadr(seq)).toEqual(cons('hoge', 10)); });
    it("The 'cadr' works cdr then cdr", () => { expect(cddr(seq)).toEqual(cons(3, null)); });
});

describe('Symbol class', () => {
    var hoge1 = Symbol.Intern('hoge'), hoge2 = Symbol.Intern('hoge'), foo = Symbol.Intern('foo');

    it('creates instance of Symbol', () => { expect(hoge1 instanceof Symbol).toBeTruthy(); });
    it('does not intern string', () => { expect(typeof hoge1).not.toBe('string'); });
    it('interns a unique symbol', () => { expect(hoge1).not.toBe(foo); });
    it('interns the same symbol when used a name already used', () => {
        expect(hoge1).toBe(hoge2);
    });
});

describe('The Parser', () => {
    beforeEach(() => this.parser = new Parser());

    var p = Symbol.Intern('+'),
        x = Symbol.Intern('*'),
        quote = Symbol.Intern('quote'),
        proc = Symbol.Intern('proc'),
        l = list;

    describe('has tokenizer', () => {
        it("returns tokenized array", () => {
            expect(this.parser.tokenize("  (cons 1 (cons 2 (cons 3 '())))")).toEqual(['(', 'cons', '1', '(', 'cons', '2', '(', 'cons', '3', "'", '(', ')', ')', ')', ')']);
        });
    });

    describe("supports 'basic pattern' as", () => {
        it("can parse '1' to '1'", () => {
            expect(this.parser.parse("1")).toBe(1);
        });

        it("can parse proc to proc", () => {
            expect(this.parser.parse("proc")).toEqual(proc);
        });

        it("can parse (+ (+ 1 2) 3) to (+ (+ 1 2) 3)", () => {
            expect(this.parser.parse("(+ (+ 1 2) 3)")).toEqual(l(p, l(p, 1, 2), 3));
        });

        it("should throw EOF error when parses ((proc 1) (proc 2)", () => {
            expect(() => { this.parser.parse("((proc 1) (proc 2)") }).toThrowError(ReadErrorMessage.EOF);
        });

        it("should throw extra colse parenthesis error when parses (+ 1 2))", () => {
            expect(() => { this.parser.parse("(+ 1 2))") }).toThrowError(ReadErrorMessage.ExtraCloseParethesis);
        });
    });

    describe("supports 'quote' as", () => {
        it("can parse '+ to (quote +)", () => {
            expect(this.parser.parse("'+")).toEqual(l(quote, p));
        });

        it("can parse '(+ + +) to (quote (+ + +))", () => {
            expect(this.parser.parse("'(+ + +)")).toEqual(l(quote, l(p, p, p)));
        });

        it("can parse (proc '(+) *) to (proc (quote (+)) *)", () => {
            expect(this.parser.parse("(proc '(+) *)")).toEqual(l(proc, l(quote, l(p)), x));
        });

        it("can parse ('proc + *) to ((quote proc) + *)", () => {
            expect(this.parser.parse("('proc + *)")).toEqual(l(l(quote, proc), p, x));
        });

        it("can parse ('(proc) + *) to ((quote (proc)) + *)", () => {
            expect(this.parser.parse("('(proc) + *)")).toEqual(l(l(quote, l(proc)), p, x));
        });
    });

    describe("supports 'boolean' as", () => {
        it("can parse (#t #f) to (true false)", () => {
            expect(this.parser.parse("(#t #f)")).toEqual(l(true, false));
        });
    });

    describe("supports 'dotted-tail notaion' as", () => {
        it("can parse '(1 . 2) to (quote (1 . 2))", () => {
            expect(this.parser.parse("'(1 . 2)")).toEqual(l(quote, cons(1, 2)));
        });

        it("can parse (proc '(1 . (2 3)) '(4 5)) to (proc (quote (1 2 3)) (quote (4 5)))", () => {
            expect(this.parser.parse("(proc '(1 . (2 3)) '(4 5))")).toEqual(l(proc, l(quote, l(1, 2, 3)), l(quote, l(4, 5))));
        });

        it("should throw error when parses (1 .)", () => {
            expect(() => { this.parser.parse("(1 .)") }).toThrowError(ReadErrorMessage.BadDotSyntax);
        });

        it("should throw error when parses (1 2 . (3 4) (5 6))", () => {
            expect(() => { this.parser.parse("(1 2 . (3 4) (5 6))") }).toThrowError(ReadErrorMessage.BadDotSyntax);
        });

        it("should throw error when parses (1 2 . (3 4) 1)", () => {
            expect(() => { this.parser.parse("(1 2 . (3 4) 1)") }).toThrowError(ReadErrorMessage.BadDotSyntax);
        });

        it("should throw error when parses (proc '(1 2 .) '(3 4))", () => {
            expect(() => { this.parser.parse("(proc '(1 2 .) '(3 4))") }).toThrowError(ReadErrorMessage.BadDotSyntax);
        });

        it("should throw error when parses '(. 2)", () => {
            expect(() => { this.parser.parse("'(. 2)") }).toThrowError(ReadErrorMessage.BadDotSyntax);
        });
    });

    describe("supports 'nil' as", () => {
        it("can parse '() to (quote null)", () => {
            expect(this.parser.parse("'()")).toEqual(l(quote, null));
        });

        it("can parse (proc '() ()) to (proc (quote null) null)", () => {
            expect(this.parser.parse("(proc '() ())")).toEqual(l(proc, l(quote, null), null));
        });
    });
});