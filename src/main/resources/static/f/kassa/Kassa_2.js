class MyFactoru {
    factory = {};
    constructor() {

        this.factory.Z1 = (a, b) => {
            console.log(a, b);
            return a - b;
        };

        this.factory.Z2 = (a) => { return a; };

        console.log(123)
        
        return this.factory;
     
    
    }
}


class MyContr {
    Contr = {}
    constructor() { console.log(1255553) }


    results = (a, b) => {
        console.log(a, b)
            return a, b
    }


    results2 = () => { this.b*1000 }
    
}



