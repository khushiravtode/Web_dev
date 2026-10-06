import mysql.connector

# Connect to MySQL
con = mysql.connector.connect(
    host="localhost",
    user="root",
    password="khushi",      # Change as per your MySQL password
    database="college"
)

cursor = con.cursor()

while True:

    print("\n----- Student CRUD -----")
    print("1. Add Student")
    print("2. Display Students")
    print("3. Update Student")
    print("4. Delete Student")
    print("5. Exit")

    choice = input("Enter Choice: ")

    # CREATE
    if choice == "1":

        roll = int(input("Enter Roll Number: "))
        name = input("Enter Name: ")

        sql = "INSERT INTO student VALUES (%s,%s)"
        cursor.execute(sql, (roll, name))
        con.commit()

        print("Student Added Successfully.")

    # READ
    elif choice == "2":

        cursor.execute("SELECT * FROM student")

        records = cursor.fetchall()

        print("\nRoll No\tName")
        print("--------------------")

        for row in records:
            print(row[0], "\t", row[1])

    # UPDATE
    elif choice == "3":

        roll = int(input("Enter Roll Number: "))
        name = input("Enter New Name: ")

        sql = "UPDATE student SET name=%s WHERE roll_no=%s"
        cursor.execute(sql, (name, roll))
        con.commit()

        print("Record Updated Successfully.")

    # DELETE
    elif choice == "4":

        roll = int(input("Enter Roll Number: "))

        sql = "DELETE FROM student WHERE roll_no=%s"
        cursor.execute(sql, (roll,))
        con.commit()

        print("Record Deleted Successfully.")

    # EXIT
    elif choice == "5":
        break

    else:
        print("Invalid Choice")

cursor.close()
con.close()
