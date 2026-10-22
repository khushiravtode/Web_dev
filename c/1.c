#include <stdio.h>
int main()
{
    FILE *fp;
    char ch;

    // Open file in write mode
    fp = fopen("data.txt", "w");

    if (fp == NULL)
    {
        printf("Unable to open file.\n");
        return 1;
    }

    // Write data into file
    printf("Enter text (press # to stop):\n");

    while ((ch = getchar()) != '#')
    {
        fputc(ch, fp);
    }

    fclose(fp);

    // Open file in read mode
    fp = fopen("data.txt", "r");

    if (fp == NULL)
    {
        printf("Unable to open file.\n");
        return 1;
    }

    // Read data from file
    printf("\nData from file:\n");

    while ((ch = fgetc(fp)) != EOF)
    {
        printf("%c", ch);
    }

    fclose(fp);

    return 0;
}