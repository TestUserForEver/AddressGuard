import { DetectionRequest, DetectionResponse } from './dtos'

function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] =
                b.charAt(i - 1) === a.charAt(j - 1)
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1)
        }
    }

    return matrix[b.length][a.length]
}

// Block rule matrix [firstN][lastN] where index 0 = first1/last1, index 4 = first5/last5
const blockMatrix = [
    [false, false, false, false, true], // First 1 + Last N
    [false, false, false, true, true], // First 2 + Last N
    [false, false, true, true, true], // First 3 + Last N
    [false, true, true, true, true], // First 4 + Last N
    [true, true, true, true, true], // First 5 + Last N
]

export class DetectionService {
    public static detect(request: DetectionRequest): DetectionResponse {
        const { from, to } = request.trace

        if (!from || !to) {
            return new DetectionResponse({
                request,
                detectionInfo: { detected: false },
            })
        }

        const fromLower = from.toLowerCase()
        const toLower = to.toLowerCase()

        // Levenshtein similarity fallback
        const distance = levenshteinDistance(fromLower, toLower)
        if (distance > 0 && distance <= 3) {
            return new DetectionResponse({
                request,
                detectionInfo: { detected: true },
            })
        }

        // Matrix-based detection: compare first N and last N
        for (let firstN = 1; firstN <= 5; firstN++) {
            const fromPrefix = fromLower.slice(0, firstN)
            const toPrefix = toLower.slice(0, firstN)
            if (fromPrefix !== toPrefix) continue

            for (let lastN = 1; lastN <= 5; lastN++) {
                const fromSuffix = fromLower.slice(-lastN)
                const toSuffix = toLower.slice(-lastN)
                if (fromSuffix !== toSuffix) continue

                if (blockMatrix[firstN - 1][lastN - 1]) {
                    return new DetectionResponse({
                        request,
                        detectionInfo: { detected: true },
                    })
                }
            }
        }

        return new DetectionResponse({
            request,
            detectionInfo: { detected: false },
        })
    }
}
