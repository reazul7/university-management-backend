export const calculateGradeAndPoints = (totalMarks: number) => {
    const grades = [
        { min: 0, max: 39, grade: 'F', gradePoints: 0.00 },
        { min: 40, max: 44, grade: 'D', gradePoints: 2.00 },
        { min: 45, max: 49, grade: 'C', gradePoints: 2.25 },
        { min: 50, max: 54, grade: 'C+', gradePoints: 2.50 },
        { min: 55, max: 59, grade: 'B-', gradePoints: 2.75 },
        { min: 60, max: 64, grade: 'B', gradePoints: 3.00 },
        { min: 65, max: 69, grade: 'B+', gradePoints: 3.25 },
        { min: 70, max: 74, grade: 'A-', gradePoints: 3.50 },
        { min: 75, max: 79, grade: 'A', gradePoints: 3.75 },
        { min: 80, max: 100, grade: 'A+', gradePoints: 4.00 }
    ];

    return grades.find(({ min, max }) => totalMarks >= min && totalMarks <= max) || { grade: 'N/A', gradePoints: 0 };
};


// export const calculateGradeAndPoints = (totalMarks: number) => {
//     let result = {
//       grade: 'NA',
//       gradePoints: 0,
//     };
  
//     if (totalMarks >= 0 && totalMarks <= 39) {
//       result = {
//         grade: 'F',
//         gradePoints: 0.00,
//       };
//     } else if (totalMarks >= 40 && totalMarks <= 44) {
//       result = {
//         grade: 'D',
//         gradePoints: 2.00,
//       };
//     } else if (totalMarks >= 45 && totalMarks <= 49) {
//       result = {
//         grade: 'C',
//         gradePoints: 2.25,
//       };
//     } else if (totalMarks >= 50 && totalMarks <= 54) {
//       result = {
//         grade: 'C+',
//         gradePoints: 2.50,
//       };
//     } else if (totalMarks >= 55 && totalMarks <= 59) {
//       result = {
//         grade: 'B-',
//         gradePoints: 2.75,
//       };
//     } else if (totalMarks >= 60 && totalMarks <= 64) {
//         result = {
//           grade: 'B',
//           gradePoints: 3.00,
//         };
//       } else if (totalMarks >= 65 && totalMarks <= 69) {
//         result = {
//           grade: 'B+',
//           gradePoints: 3.25,
//         };
//       } else if (totalMarks >= 70 && totalMarks <= 74) {
//         result = {
//           grade: 'A-',
//           gradePoints: 3.50,
//         };
//       } else if (totalMarks >= 75 && totalMarks <= 79) {
//         result = {
//           grade: 'A',
//           gradePoints: 3.75,
//         };
//       } else if (totalMarks >= 80 && totalMarks <= 100) {
//         result = {
//           grade: 'A+',
//           gradePoints: 4.00,
//         };
//       } else {
//       result = {
//         grade: 'NA',
//         gradePoints: 0,
//       };
//     }
  
//     return result;
//   };