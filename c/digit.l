%option noyywrap

%{
#include <stdio.h>

/* Variable to store the number of digits */
int count = 0;
%}

/* Flex rules */
%%
[0-9]    { count++; }   /* If a digit is found, increase count */

\n       {              /* When Enter is pressed */
             printf("Number of digits = %d\n", count);
             return 0;  /* Stop scanning */
         }

.        ;              /* Ignore all other characters */
%%

/* Main function */
int main()
{
    /* Ask the user to enter input */
    printf("Enter something: ");

    /* Start the Flex scanner */
    yylex();

    return 0;
}
