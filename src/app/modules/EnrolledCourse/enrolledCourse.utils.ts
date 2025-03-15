export const calculateGradeAndPoints = (totalMarks: number) => {
    const grades = [
        { min: 0, max: 39, grade: 'F', gradePoints: 0.0 },
        { min: 40, max: 44, grade: 'D', gradePoints: 2.0 },
        { min: 45, max: 49, grade: 'C', gradePoints: 2.25 },
        { min: 50, max: 54, grade: 'C+', gradePoints: 2.5 },
        { min: 55, max: 59, grade: 'B-', gradePoints: 2.75 },
        { min: 60, max: 64, grade: 'B', gradePoints: 3.0 },
        { min: 65, max: 69, grade: 'B+', gradePoints: 3.25 },
        { min: 70, max: 74, grade: 'A-', gradePoints: 3.5 },
        { min: 75, max: 79, grade: 'A', gradePoints: 3.75 },
        { min: 80, max: 100, grade: 'A+', gradePoints: 4.0 },
    ]

    return grades.find(({ min, max }) => totalMarks >= min && totalMarks <= max) || { grade: 'N/A', gradePoints: 0 }
}
