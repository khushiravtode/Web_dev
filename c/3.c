#include <stdio.h>
#include <string.h>
#include <ctype.h>

int isKeyword(char word[])
{
    char keywords[][10] = {
        "int", "float", "char", "if", "else",
        "for", "while", "return", "void", "main"
    };

    int i;

    for (i = 0; i < 10; i++)
    {
        if (strcmp(word, keywords[i]) == 0)
            return 1;
    }

    return 0;
}

int main()
{
    FILE *fp;
    char ch, word[50];
    int i;

    fp = fopen("input.txt", "r");

    if (fp == NULL)
    {
        printf("Unable to open file.\n");
        return 1;
    }

    printf("Lexical Analysis:\n\n");

    while ((ch = fgetc(fp)) != EOF)
    {
        // Identify keywords and identifiers
        if (isalpha(ch) || ch == '_')
        {
            i = 0;

            while (isalnum(ch) || ch == '_')
            {
                word[i++] = ch;
                ch = fgetc(fp);
            }

            word[i] = '\0';

            if (isKeyword(word))
                printf("%s -> Keyword\n", word);
            else
                printf("%s -> Identifier\n", word);
        }

        // Identify numbers
        else if (isdigit(ch))
        {
            i = 0;

            while (isdigit(ch))
            {
                word[i++] = ch;
                ch = fgetc(fp);
            }

            word[i] = '\0';

            printf("%s -> Number\n", word);
        }

        // Identify operators
        else if (ch == '+' || ch == '-' || ch == '*' ||
                 ch == '/' || ch == '=' || ch == '<' ||
                 ch == '>')
        {
            printf("%c -> Operator\n", ch);
        }

        // Identify special symbols
        else if (ch == ';' || ch == ',' || ch == '(' ||
                 ch == ')' || ch == '{' || ch == '}')
        {
            printf("%c -> Special Symbol\n", ch);
        }
    }

    fclose(fp);

    return 0;
}