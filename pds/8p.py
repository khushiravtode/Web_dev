file="students.txt"

while True:

    print("1.Add")
    print("2.Display")
    print("3.Search")
    print("4.Delete")
    print("5.Exit")

    choice =input("Enter your choice:")
    if choice=="1":
        roll=input("Enter RollNo:")
        name=input("Enter Name:")
        with open(file ,"a") as f:
            f.write(roll+","+name +"\n")

    if choice=="2":
        with open (file,"r") as f:
            print(f.read())

    if choice=="3":
        roll=input("Enter roll:")
        found=False
        with open (file,"r") as f:
            for line in f:
                if line.startswith(roll):
                    found=True
                    print("line found:",line)
                else:
                    print("No Record found")

    if choice=="4":
            roll=input("Enter RollNO:")
            
            with open (file,"r") as f:
                lines=f.readlines()

            with open (file,"w") as f:
                 for line in lines:
                      if not line.startswith(roll):
                        f.write(line)
    if choice=="5":
            break

