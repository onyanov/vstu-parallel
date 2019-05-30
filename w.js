var OCCUPIED = 1; //метка "поле бьётся"
var FREE = 0; //метка "поле не бьётся"
var ISHERE = -1; //метка "ферзь тут"
var solutions = new Array(); //будущие решения
var startColumn;

onmessage = function(event) {
    var N = event.data.size;
    startColumn = event.data.startColumn;
    
    q = new Queen(N);
    q.run();

    postMessage(solutions);

};

function Queen(N) { //Реализация проблемы об N ферзях
    this.N = N;
    this.columns = new Array(this.N); //столбцы
    var numberOfDiagonals = 2 * this.N - 1; //число диагоналей
    this.diagonals1 = new Array(numberOfDiagonals); //диагонали доски
    this.diagonals2 = new Array(numberOfDiagonals);
    for (var index = 0; index < numberOfDiagonals; ++index) {
        if (index < this.N) this.columns[index] = ISHERE;
        this.diagonals1[index] = FREE;
        this.diagonals2[index] = FREE;
    }

    this.run = function () { //метод для запуска поиска
        var thisDiag1 = startColumn;
        var thisDiag2 = this.N - 1 + startColumn;
        this.columns[startColumn] = 0;
        this.diagonals1[thisDiag1] = OCCUPIED; //занять диагонали, которые теперь бьются
        this.diagonals2[thisDiag2] = OCCUPIED;
            
        this.calculate(1);
    }

    this.calculate = function (row) { //метод для поиска всех возможных решений
        for (var column = 0; column < this.N; ++column) {
            if (this.columns[column] >= 0) continue; //текущий столбец бьётся, продолжить
            var thisDiag1 = row + column;
            if (this.diagonals1[thisDiag1] == OCCUPIED) continue; //диагональ '\' для текущих строки и столбца бьётся, продолжить
            var thisDiag2 = this.N - 1 - row + column;
            if (this.diagonals2[thisDiag2] == OCCUPIED) continue; //диагональ '/' для текущих строки и столбца бьётся, продолжить
            this.columns[column] = row;
            this.diagonals1[thisDiag1] = OCCUPIED; //занять диагонали, которые теперь бьются
            this.diagonals2[thisDiag2] = OCCUPIED;
            if (row == this.N - 1) solutions.push(this.columns.slice()); //найдена последняя строка - есть решение
            else this.calculate(row + 1); //иначе рекурсия
            this.columns[column] = ISHERE;
            this.diagonals1[thisDiag1] = FREE;
            this.diagonals2[thisDiag2] = FREE;
        }
    }
}
