#include <stdio.h>
#include <string.h>
#include <ctype.h>

int isKeyword(char word[])
{
    char keywords[][10] = {
        "auto", "break", "case", "char", "const",
        "continue", "default", "do", "double", "else",
        "enum", "extern", "float", "for", "goto",
        "if", "int", "long", "register", "return",
        "short", "signed", "sizeof", "static", "struct",
        "switch", "typedef", "union", "unsigned", "void",
        "volatile", "while"
    };

    int i;

    for (i = 0; i < 32; i++)
    {
        if (strcmp(word, keywords[i]) == 0)
            return 1;
    }

    return 0;
}

int main()
{
    FILE *fp;
    char word[50];

    fp = fopen("input.txt", "r");

    if (fp == NULL)
    {
        printf("Unable to open file.\n");
        return 1;
    }

    printf("Keywords and Identifiers:\n\n");

    while (fscanf(fp, "%49s", word) != EOF)
    {
        // Remove common special characters
        int len = strlen(word);

        while (len > 0 && !isalnum(word[len - 1]) && word[len - 1] != '_')
        {
            word[len - 1] = '\0';
            len--;
        }

        if (isKeyword(word))
        {
            printf("%s -> Keyword\n", word);
        }
        else if (isalpha(word[0]) || word[0] == '_')
        {
            printf("%s -> Identifier\n", word);
        }
    }

    fclose(fp);

    return 0;
}
