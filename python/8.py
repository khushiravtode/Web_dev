file = "student.txt"

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

        with open(file, "a") as f:
            f.write(roll + "," + name + "\n")

    elif choice == "2":

        with open(file, "r") as f:
            print(f.read())

    elif choice == "3":

        roll = input("Enter Roll No: ")

        with open(file, "r") as f:

            found = False

            for line in f:

                if line.startswith(roll + ","):
                    print("Record Found:", line)
                    found = True

            if not found:
                print("Record Not Found")

    elif choice == "4":

        roll = input("Enter Roll No: ")

        with open(file, "r") as f:
            lines = f.readlines()

        with open(file, "w") as f:

            for line in lines:

                if not line.startswith(roll + ","):
                    f.write(line)

    elif choice == "5":
        break
