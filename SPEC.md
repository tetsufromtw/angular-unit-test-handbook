# Overview

請以下列的 unit test 為基礎 去寫出對應的 angular component 與網頁

```ts
describe("A suite", function() {
    it("contains a spec with an expectation", function() {
        expect(true).toBe(true);
    });
});

describe("A suite is just a function", function() {
    let a;

    it("and so is a spec", function() {
        a = true;

        expect(a).toBe(true);
    });
});


describe("The 'toBe' matcher compares with ===", function() {

    it("and has a positive case", function() {
        expect(true).toBe(true);
    });


    it("and can have a negative case", function() {
        expect(false).not.toBe(true);
    });
});


describe("A suite with some shared setup", function() {
    let foo = 0;
    beforeEach(function() {
        foo += 1;
    });
    afterEach(function() {
        foo = 0;
    });
    beforeAll(function() {
        foo = 1;
    });
    afterAll(function() {
        foo = 0;
    });

    describe("A spec", function() {
        beforeEach(function() {
            this.foo = 0;
        });

        it("can use the `this` to share state", function() {
            expect(this.foo).toEqual(0);
            this.bar = "test pollution?";
        });

        it("prevents test pollution by having an empty `this` " +
            "created for the next spec", function() {
            expect(this.foo).toEqual(0);
            expect(this.bar).toBe(undefined);
        });
    });

     describe("A spec using the fail function", function() {
        function foo(x, callBack) {
            if (x) {
                callBack();
            }
        }

        it("should not call the callBack", function() {
            foo(false, function() {
                fail("Callback has been called");
            });
        });
    });

    describe("A spec", function() {
        let foo;

        beforeEach(function() {
            foo = 0;
            foo += 1;
        });

        afterEach(function() {
            foo = 0;
        });

        it("is just a function, so it can contain any code", function() {
            expect(foo).toEqual(1);
        });

        it("can have more than one expectation", function() {
            expect(foo).toEqual(1);
            expect(true).toEqual(true);
        });

        describe("nested inside a second describe", function() {
            let bar;

            beforeEach(function() {
                bar = 1;
            });

            it("can reference both scopes as needed", function() {
                expect(foo).toEqual(bar);
            });
        });
    });

    xdescribe("A spec", function() {
        let foo;

        beforeEach(function() {
            foo = 0;
            foo += 1;
        });

        it("is just a function, so it can contain any code", function() {
            expect(foo).toEqual(1);
        });
    });

    describe("Pending specs", function() {
    xit("can be declared 'xit'", function() {
            expect(true).toBe(false);
        });
        it("can be declared with 'it' but without a function");

         it("can be declared by calling 'pending' in the spec body", function() {
            expect(true).toBe(false);
            pending('this is why it is pending');
        });
    });
});


describe("Using async/await", function () {
    beforeEach(async function () {
        await soon();
        value = 0;
    });

    it("supports async execution of test preparation and expectations",
        async function () {
            await soon();
            value++;
            expect(value).toBeGreaterThan(0);
        }
    );

    function soon() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, 1);
        });
    }
});

describe("long asynchronous specs", function() {
    beforeEach(async function() {
        await somethingSlow();
    }, 1000);

    it("takes a long time", async function() {
        await somethingReallySlow();
    }, 10000);

    afterEach(async function() {
        await somethingSlow();
    }, 1000);
});


describe("A spy", function() {
    let foo;
    let bar = null;

    beforeEach(function() {
        foo = {
            setBar: function (value) {
                bar = value;
            }
        };

     spyOn(foo, 'setBar');

        foo.setBar(123);
        foo.setBar(456, 'another param');
    });

    it("tracks that the spy was called", function() {
        expect(foo.setBar).toHaveBeenCalled();
    });

    it("tracks that the spy was called x times", function() {
        expect(foo.setBar).toHaveBeenCalledTimes(2);
    });

     it("tracks all the arguments of its calls", function() {
        expect(foo.setBar).toHaveBeenCalledWith(123);
        expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
    });

      foo.setBar();

        expect(foo.setBar.calls.any()).toEqual(true);
    });
});


describe("A spy, when created manually", function() {
    let whatAmI;

    beforeEach(function() {
        whatAmI = jasmine.createSpy('whatAmI');

        whatAmI("I", "am", "a", "spy");
    });

    it("tracks that the spy was called", function() {
        expect(whatAmI).toHaveBeenCalled();
    });
});

describe("Multiple spies, when created manually", function() {
    let tape;

    beforeEach(function() {
        tape = jasmine.createSpyObj(
            'tape',
            ['play', 'pause', 'stop', 'rewind']
        );

        tape.play();
        tape.pause();
        tape.rewind(0);
    });

    it("creates spies for each requested function", function() {
        expect(tape.play).toBeDefined();
        expect(tape.pause).toBeDefined();
        expect(tape.stop).toBeDefined();
        expect(tape.rewind).toBeDefined();
    });
});

describe("Matching with finesse", function() {

    describe("jasmine.any", function () {
        it("matches any value", function () {
            expect({}).toEqual(jasmine.any(Object));
            expect(12).toEqual(jasmine.any(Number));
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const foo = jasmine.createSpy('foo');
                foo(12, function () {
                    return true;
                });

                expect(foo).toHaveBeenCalledWith(
                    jasmine.any(Number), jasmine.any(Function)
                );
            });
        });
    });

     describe("jasmine.anything", function () {
        it("matches anything", function () {
            expect(1).toEqual(jasmine.anything());
        });

        describe("when used with a spy", function () {
            it("is useful when the argument can be ignored", function () {
                const foo = jasmine.createSpy('foo');
                foo(12, function () {
                    return false;
                });

                expect(foo).toHaveBeenCalledWith(12, jasmine.anything());
            });
        });
    });

    describe("jasmine.objectContaining", function () {
        let foo;

        beforeEach(function () {
            foo = {
                a: 1,
                b: 2,
                bar: "baz"
            };
        });

        it("matches objects with the expect key/value pairs", function () {
            expect(foo).toEqual(jasmine.objectContaining({
                bar: "baz"
            }));
            expect(foo).not.toEqual(jasmine.objectContaining({
                c: 37
            }));
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback({
                    bar: "baz"
                });

                expect(callback).toHaveBeenCalledWith(
                    jasmine.objectContaining({bar: "baz"})
                );
            });
        });
    });

    describe("jasmine.arrayContaining", function () {
        let foo;

        beforeEach(function () {
            foo = [1, 2, 3, 4];
        });

        it("matches arrays with some of the values", function () {
            expect(foo).toEqual(jasmine.arrayContaining([3, 1]));
            expect(foo).not.toEqual(jasmine.arrayContaining([6]));
        });

        describe("when used with a spy", function () {
            it("is useful when comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback([1, 2, 3, 4]);

                expect(callback).toHaveBeenCalledWith(
                    jasmine.arrayContaining([4, 2, 3])
                );
                expect(callback).not.toHaveBeenCalledWith(
                    jasmine.arrayContaining([5, 2])
                );
            });
        });
    });

     describe('jasmine.stringMatching', function () {
        it("matches as a regexp", function () {
            expect({foo: 'bar'}).toEqual({
                foo: jasmine.stringMatching(/^bar$/)
            });
            expect({foo: 'foobarbaz'}).toEqual({
                foo: jasmine.stringMatching('bar')
            });
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback('foobarbaz');

                expect(callback).toHaveBeenCalledWith(
                    jasmine.stringMatching('bar')
                );
                expect(callback).not.toHaveBeenCalledWith(
                    jasmine.stringMatching(/^bar$/)
                );
            });
        });
    });

    describe("custom asymmetry", function () {
        const tester = {
            asymmetricMatch: function (actual) {
                const secondValue = actual.split(',')[1];
                return secondValue === 'bar';
            }
        };

        it("dives in deep", function () {
            expect("foo,bar,baz,quux").toEqual(tester);
        });

        describe("when used with a spy", function () {
            it("is useful for comparing arguments", function () {
                const callback = jasmine.createSpy('callback');

                callback('foo,bar,baz');

                expect(callback).toHaveBeenCalledWith(tester);
            });
        });
    });

    describe("Manually ticking the Jasmine Clock", function () {
        let timerCallback;
        beforeEach(function () {
            timerCallback = jasmine.createSpy("timerCallback");
            jasmine.clock().install();
        });
        afterEach(function () {
            jasmine.clock().uninstall();
        });

         it("causes a timeout to be called synchronously", function () {
            setTimeout(function () {
                timerCallback();
            }, 100);

            expect(timerCallback).not.toHaveBeenCalled();

            jasmine.clock().tick(101);

            expect(timerCallback).toHaveBeenCalled();
        });

        it("causes an interval to be called synchronously", function () {
            setInterval(function () {
                timerCallback();
            }, 100);

            expect(timerCallback).not.toHaveBeenCalled();

            jasmine.clock().tick(101);
            expect(timerCallback.calls.count()).toEqual(1);

            jasmine.clock().tick(50);
            expect(timerCallback.calls.count()).toEqual(1);

            jasmine.clock().tick(50);
            expect(timerCallback.calls.count()).toEqual(2);
        });

        describe("Mocking the Date object", function () {
            it("mocks the Date object and sets it to a given time", function () {
                const baseTime = new Date(2013, 9, 23);
                 jasmine.clock().mockDate(baseTime);

                jasmine.clock().tick(50);
                expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
            });
        });
    });
});

```

# 注意事項

1. 請以教學式的方式去設計對應的元件跟網頁
2. 我希望是一頁式的往下
3. 我希望程式碼呈現的方式可以讓我清楚知道 這個測試對應哪種檔案 所以請你命名要正確清楚 要夠 FAANG 不要全部寫在同一個檔案
