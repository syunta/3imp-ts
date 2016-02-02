/// <reference path = "../app" />

describe('Cell class', () => {

    describe('creates instance', () => {
        var numberCell = new Cell(1, 2);

        it('has car', () => { expect(numberCell.car).toBe(1); });
        it('has cdr', () => { expect(numberCell.cdr).toBe(2); });
    });
    /* TODO: all test

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
    var parsed8 = parser.parse("(#t #f)"); // (true false)
    var parsed9 = parser.parse("'(1 . 2)"); // (quote (1 . 2))
    var parsed10 = parser.parse("(append '(1 . (2 3)) '(4 5))"); // (append (quote (1 2 3)) (quote (4 5)))
    */
});