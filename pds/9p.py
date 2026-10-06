import csv

file="stu.csv"

while True:
        print("1.add")
        print("2.Display")
        print("3.serch")
        print("4.Delete")
        print("5.Exit")
        
        choice=input("Enter Coice")

        if choice=="1":
            
            roll=input("Enter roll:")
            name=input("Enter Name:")
            
            with open(file,"a",newline="") as f:
                    writer=csv.writer(f)
                    writer.writerow([roll,name])

        if choice=="2":
            with open(file,"r") as f:
                reader=csv.reader(f)
                for row in reader:
                    print(row)

        if choice=="3":
                roll=input("Enter roll:")
                with open(file,"r") as f:
                    reader=csv.reader(f)
                    for row in reader:
                        if row[0]== roll:
                                print(row)

        if choice=="4":
                roll=input("Enter roll:")
                rows=[]

                with open(file,"r") as f:
                    reader=csv.reader(f)
                    for row in reader:
                        if row[0]!=roll:
                            rows.append(row)
                with open(file,"w",newline="") as f:
                    writer=csv.writer(f)
                    writer.writerows(rows)
        if choice=="5":
                break
