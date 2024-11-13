class Table {
    constructor() {
        let options = { isStatic: true };
        this.boundaries = [
            Bodies.rectangle(width / 2, 0, width, 20, options),
            Bodies.rectangle(width / 2, height, width, 20, options),
            Bodies.rectangle(0, height / 2, 20, height, options),
            Bodies.rectangle(width, height / 2, 20, height, options)
        ];
        World.add(world, this.boundaries);
    }

    show() {
        fill(139, 69, 19);
        for (let boundary of this.boundaries) {
            push();
            translate(boundary.position.x, boundary.position.y);
            rectMode(CENTER);
            rect(0, 0, boundary.bounds.max.x - boundary.bounds.min.x, boundary.bounds.max.y - boundary.bounds.min.y);
            pop();
        }
    }
}