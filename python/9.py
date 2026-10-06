import csv

file = "student.csv"

while True:

    print("\n1.Add")
    print("2.Display")
    print("3.Search")
    print("4.Delete")
    print("5.Exit")

    choice = input("Enter Choice: ")

    if choice == "1":

        roll = input("Enter Roll No: ")
        name = input("Enter Name: ")

        with open(file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([roll, name])

    elif choice == "2":

        with open(file, "r") as f:
            reader = csv.reader(f)

            for row in reader:
                print(row)

    elif choice == "3":

        roll = input("Enter Roll No: ")

        with open(file, "r") as f:
            reader = csv.reader(f)

            for row in reader:

                if row[0] == roll:
                    print(row)

    elif choice == "4":

        roll = input("Enter Roll No: ")

        rows = []

        with open(file, "r") as f:
            reader = csv.reader(f)

            for row in reader:

                if row[0] != roll:
                    rows.append(row)

        with open(file, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(rows)

    elif choice == "5":
       Break

