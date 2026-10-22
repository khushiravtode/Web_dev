#include <stdio.h>
#include <string.h>

int main() {
    char production[100];     // To store full production (e.g., A->abc|abd)
    char lhs;                 // Left-hand side variable (A)
    char part1[50], part2[50]; // To store RHS parts
    char common[50];          // To store common prefix
    int i, j = 0;

    printf("Enter production (Example: A->abc|abd): ");
    scanf("%s", production);

    // Extract LHS (first character before ->)
    lhs = production[0];

    // Find position of '|'
    char *ptr = strchr(production, '|');

    // If no '|' found, no need of left factoring
    if (ptr == NULL) {
        printf("No left factoring needed.\n");
        return 0;
    }

    // Find position of '|'
    int pos = ptr - production;

    // Extract first part after "A->"
    // "A->" is 3 characters, so start from index 3
    strncpy(part1, production + 3, pos - 3);
    part1[pos - 3] = '\0';   // Null terminate string

    // Extract second part (after '|')
    strcpy(part2, ptr + 1);

    // Find longest common prefix
    for (i = 0; part1[i] != '\0' && part2[i] != '\0'; i++) {
        if (part1[i] == part2[i]) {
            common[j++] = part1[i];
        } else {
            break;
        }
    }
    common[j] = '\0';   // Null terminate common prefix

    // If no common prefix found
    if (strlen(common) == 0) {
        printf("\nNo left factoring possible.\n");
    } 
    else {
        printf("\nLeft Factored Grammar:\n");

        // Print new production
        printf("%c -> %s%c'\n", lhs, common, lhs);

        // Print new derived productions
        printf("%c' -> %s | %s\n", lhs, part1 + i, part2 + i);
    }

    return 0;
}