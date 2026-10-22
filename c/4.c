#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct Symbol
{
    char name[20];
    int address;
};

struct Literal
{
    char name[20];
    int address;
};

int main()
{
    FILE *fp;
    char line[100];
    char label[20], opcode[20], operand[20];

    struct Symbol symtab[20];
    struct Literal littab[20];

    int symCount = 0;
    int litCount = 0;
    int LC = 0;

    fp = fopen("input1.txt", "r");

    if (fp == NULL)
    {
        printf("File not found!\n");
        return 1;
    }

    while (fgets(line, sizeof(line), fp))
    {
        label[0] = '\0';
        opcode[0] = '\0';
        operand[0] = '\0';

        /* Read line with or without label */
        if (line[0] == ' ' || line[0] == '\t')
            sscanf(line, "%s %s", opcode, operand);
        else
            sscanf(line, "%s %s %s", label, opcode, operand);

        /* START */
        if (strcmp(label, "START") == 0)
        {
            LC = atoi(opcode);
            continue;
        }

        /* Add label to SYMTAB */
        if (label[0] != '\0' &&
            strcmp(label, "START") != 0 &&
            strcmp(label, "END") != 0)
        {
            strcpy(symtab[symCount].name, label);
            symtab[symCount].address = LC;
            symCount++;
        }

        /* END */
        if (strcmp(opcode, "END") == 0)
            break;

        /* Check literal */
        if (strstr(operand, "=") != NULL)
        {
            char *p = strstr(operand, "=");

            strcpy(littab[litCount].name, p);
            littab[litCount].address = 0;
            litCount++;
        }

        /* Update LC */
        if (strcmp(opcode, "DS") == 0)
        {
            LC += atoi(operand);
        }
        else if (strcmp(opcode, "DC") == 0)
        {
            LC++;
        }
        else
        {
            LC++;
        }
    }

    fclose(fp);

    /* Assign literal addresses */
    for (int i = 0; i < litCount; i++)
    {
        littab[i].address = LC;
        LC++;
    }

    /* Display SYMTAB */
    printf("\nSYMTAB\n");
    printf("-------------------------\n");
    printf("Index\tSymbol\tAddress\n");
    printf("-------------------------\n");

    for (int i = 0; i < symCount; i++)
    {
        printf("%d\t%s\t%d\n",
               i + 1,
               symtab[i].name,
               symtab[i].address);
    }

    /* Display LITTAB */
    printf("\nLITTAB\n");
    printf("-------------------------\n");
    printf("Index\tLiteral\tAddress\n");
    printf("-------------------------\n");

    for (int i = 0; i < litCount; i++)
    {
        printf("%d\t%s\t%d\n",
               i + 1,
               littab[i].name,
               littab[i].address);
    }

    return 0;
}