// Module to generate math problems to use on the registration page.
use rand::distributions::{Distribution, Uniform};

pub struct EquationSystem2x2 {
    x: i32,
    y: i32,
    matrix: [[i32; 3] ; 2],
}

impl EquationSystem2x2 {
    // This naive implementation could theoretically take forever to finish.
    // In practice, only 27 out of a billion registration requests will take
    // more than three generations.
    pub fn new() -> EquationSystem2x2 {
        let mut p = EquationSystem2x2 { x: 0, y: 0, matrix: [[0; 3] ; 2] };
        p.generate();
        while !p.is_valid() {
            p.generate();
        }
        return p;
    }

    // Returns string of equations separated by :: delimiter.
    pub fn to_string(&self) -> String {
        format!("{}x + {}y = {}::{}x + {}y = {}",
                self.matrix[0][0], self.matrix[0][1], self.matrix[0][2],
                self.matrix[1][0], self.matrix[1][1], self.matrix[1][2])
    }

    // Returns the values by alphabetic name, separated by :: delimiter
    pub fn answer_string(&self) -> String {
        format!("{}::{}", self.x, self.y)
    }

    // Simple generation of a system of equations problem.
    // Returns an is_valid() -> true problem roughly 99.7% of the time.
    fn generate(&mut self) {
        let dist = Uniform::from(1..101);
        let mut rng = rand::thread_rng();

        self.x = dist.sample(&mut rng);
        self.y = dist.sample(&mut rng);

        let mut dieroll;

        // Fill in random coefficients
        for i in 0..2 {
            for j in 0..2 {
                self.matrix[i][j] = dist.sample(&mut rng);
                dieroll = dist.sample(&mut rng);
                if dieroll < 31 { // 30% chance of negative coefficient
                    self.matrix[i][j] = -self.matrix[i][j];
                }
            }
        }

        self.matrix[0][2] = self.matrix[0][0] * self.x +
                            self.matrix[0][1] * self.y;
        self.matrix[1][2] = self.matrix[1][0] * self.x +
                            self.matrix[1][1] * self.y;
    }

    // If the determinant of a matrix of coefficients is 0, it means
    // there are either no solutions or multiple valid solutions.
    // Example: 10x + -5y = 75, -10x + 5y = -75
    fn is_valid(&self) -> bool {
        return (self.matrix[0][0] * self.matrix[1][1] -
                self.matrix[1][0] * self.matrix[0][1]) != 0;
    }
}
