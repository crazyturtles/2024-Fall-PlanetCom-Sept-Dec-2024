# **Pumpmaster Version 3.0** 
![Jest Tests](https://github.com/DMIT-2590/2024-Fall-PlanetCom/actions/workflows/jest.yml/badge.svg?branch=sprint-3-testing)

![Pumpmaster Logo](PumpMaster-V1/pump_master/public/img/pumpmaster-logo-2.1-transparent.png)

# PumpMaster V3

User Manual

## Table of Contents
- [What is PumpMaster V3](#what-is-pumpmaster-v3-)
- [Logging in the PumpMaster V3](#logging-in-the-pumpmaster-v3-)
- [Explore the Job Board](#explore-the-job-board-)
- [Right Clicking a Listing on the Job Board](#right-clicking-a-listing-on-the-job-board-)
- [Job Creation](#job-creation-)
- [Modify a Job](#modify-a-job-)
- [Manage Data](#manage-data-)
  - [Technician](#technician-)
  - [Supplier](#supplier-)
  - [Job Types](#job-types-)
  - [Pour Types](#pour-types-)
  - [Units](#units-)
  - [Customer](#customer-)
  - [Operator](#operator)
  - [Company Information](#company-information-)
- [Reporting](#reporting-)
  - [Customer Job History](#customer-job-history-)
  - [Amount Pumped by Job Type](#amount-pumped-by-job-type-)
  - [Amount Pumped by Pump and Date](#amount-pumped-by-pump-and-date-)
  - [Amount Poured by Unit Since Pipe Change](#amount-poured-by-unit-since-pipe-change-)
  - [Job Count Details](#job-count-details-)
  - [Customer History](#customer-history-)

## What is PumpMaster V3 [↑](#table-of-contents)

PumpMaster is a web application that aims to help a Concrete Pumping company with daily operations. The PumpMaster V3 is an upgrade from the PumpMasterV2; the new application still retains the robust functionality of its predecessor, from maintaining all data essential to the end user's daily operation to creating, scheduling, and assigning a job. With a newer and a more user-friendly user interface, the PumpMasterV3 application aims to make the work of the end user a lot more efficient and that will directly translate to the company's success.

## Logging in the PumpMaster V3 [↑](#table-of-contents)

Every time a user needs to access PumpMaster V3, they are required to log in using their credentials. Each user has their user access roles.

If a new user will need to use the application, an existing user with Administrator permission should add the new user and specify what roles/restrictions it would have when using the application.

![Login Screen][login-screen]

Logging in is as simple as inputting your username and password then clicking logon.

The default username is **admin** and the default password is **Password1**. To change these you will have to modify the PM_Users table in the PumpMasterDB database.

![User Profile Menu][user-profile-menu]

Once logged in the user will have access to a submenu in the top right of the screen. This submenu is mostly unfunctional at the moment. Ideally, the user should be able to modify some of their profile settings. The Create User allows an admin to create a new user. The sign out button will sign out the current user and redirect them back to the login page.

![Create User Form][create-user-form]

1. The username is a required field that can be whatever the new user wants it to be.
2. The Role allows the user to select what role the user will have from the drop-down menu.
3. Password should be at least 8 characters and is a required field.
4. Confirm password requires the user to reenter the same password.

(Note: a user will be automatically signed out after 12 hours).

## Explore the Job Board [↑](#table-of-contents)

The job board (on today's date) is where the user is taken by default after logging in. It shows the various jobs for each day and can access jobs from the past to future jobs. Jobs can be double clicked to bring up an edit screen for that listing. If the user right clicks on a job they will have many options to modify that job listing.

![Job Board Main View][job-board-main]

1. This button navigates to job listings from the previous day.
2. This button can be clicked to view a calendar to easily navigate to view job listings from any day the user chooses.
3. This button will bring the job board back to listings for the current day.
4. This button navigates to a job listings for the next day.

![Time Display][time-display]

The button in the upper middle of the job board can be clicked to display the current local time.

![Search Interface][search-interface]

1. The job status button can be clicked to show all the units available for a job that day. A unit is considered available as long as it is not assigned to 7 jobs that day.

![Job Status View][job-status]

2. The Search button allows a user to search for a job according to either its Ticket# or by Customer.

![Search By Ticket][search-by-ticket]

### Right Clicking a Listing on the Job Board [↑](#table-of-contents)

![Right Click Menu][right-click-menu]

1. Clicking a New Job will bring the user to the job creation screen.
2. Clicking on New Job from Template will bring all the current information from that job to be used for a new job listing.
3. Clicking on Edit job allows a user to edit the information for a job listing.
4. Clicking Reset Job resets the job status to pending.
5. Clicking Cancel Job will cancel that job and puts the job status for that job to cancelled.
6. Clicking Assign Job to Unit allows the user to easily assign a unit to that job.
7. Clicking Confirm allows you to confirm either the customer, supplier, operator or job for that listing.
8. Clicking Washing assigns the jobs status to washing.
9. Clicking Complete Job sets the jobs status to complete.
10. Clicking Change Operator will allow the user to easily assign an operator to that job.
11. Clicking Send Message allows the user to send a message to any operator assigned to that job.
12. Clicking Clear Message Icon will remove the sent message icon from beside an operator.
13. Clicking Print will bring up a print screen to print off some of the job details.
14. Clicking Customer History will list all the jobs for that customer.
15. Clicking Cancel will close the menu.

## Job Creation [↑](#table-of-contents)

When a new job comes in the user will have to create a job. The user can access the job creation pop-up by either clicking on "Job Creator" in the navigation or by right clicking on a pre-existing job and selecting "New Job". If the user wants to copy the items from one job and use those to create a new job, they can select the "New Job from Template" option in the right click menu.

![Job Creation Form][job-creation-form]

1. The Ticket Number will be auto generated based of the job Date (#3)
2. The user can search for a customer or supplier and select it from their respective drop down.
3. The user can set the Job Start Date.
4. Here the user will set the job start time with concrete on site getting auto updated to be 30 mins ahead of arrival on site.
5. The user can add a new contact to the contact list by having the checkbox checked and typing into the field.

![Contact Selection Popup][contact-selection-popup]

1.	The search bar is in the top left of the select contact and it will filter what contact you're looking for. 
2.	The user can delete a contact if it is no longer necessary. 
3.	The user can close this by either clicking outside of the pop-up or by hitting the “X”. 
4.	The user will select a pump type that has a preset hourly rate.    
5.	The user will select what Pour Types they want and be able to remove selected pour types.
6.	the user will set the required m3 to complete the job.
7.	The user will set the rate that of which the concrete is being poured if not set by pump type
8.	This displays the total for the row of items which will be used to calculate the overall total. 
9.	The carbon Levy is in a drop-down field. The rate is in a whole number instead of being in decimals. 
10.	This is the summary of the job where all of the totals are calculated and displayed.
11.	This will allow the user to save the job.
12.	This will show a report to the user so that they can print it out
13.	This will allow the user to set a custom colour for the job. 
14.	This allows the user to delete a job once it has been created. The user will get two confirmation boxes, one where the user has to select a checkbox and the other being a random 4-digit code that the user has to enter. 
15.	The user can click on either the “X” to close the form or click to the outside of the form. 

## Modify a Job [↑](#table-of-contents)

For the user to edit a job they would need to select the job they want to edit, right click it, and select "Edit Job".

![Job Modification Form][job-modification-form]

1. When editing a job, the search field does not appear for both customer and supplier giving more room to properly display the customer and supplier.
2. The add contact is grayed out and will not save a contact to the contact list.
3. When there is a site address the user can click on the pin icon which will open google maps to the correct location
4. All the drop-down fields are the same except for what items they are affecting which is differentiated by the title of each drop down
5. The selected pour types are displayed below selected pour types for convince when editing pour types.
6. There is a live total update which will automatically get updated when any of the values on the right get altered.

## Manage Data [↑](#table-of-contents)

The manage data section of PumpMaster V3 will handle all the essential data that the End User needs for their daily operation.

### Technician [↑](#table-of-contents)

The Technician page allows the user to Add, Edit or Inactivate a technician. The list of units is sorted by their status of Active, Inactive and All.

![Technician Management][technician-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by technicians:
   - All shows both active/inactive technicians
   - Active shows only active technicians
   - Inactive shows only inactive technicians
2. User may search for a technician using the search bar. This will only show technicians that match the currently selected active/inactive filters.
3. If a technician is selected from this area, their information will be loaded onto the form. This information can be edited.
4. Clicking Add New Technician will clear the form so a new technician may be added. (Note: This will also change the Save button to Add).
5. User may input Technician information.
6. To save any changes made to a new or existing technician, the user must click the Add/Save button.
7. Cancel any changes that have not been saved and return to the last page visited.

### Supplier [↑](#table-of-contents)

The Supplier page allows the user to Add, Edit or Inactivate a supplier. The list of units is sorted by their status of Active, Inactive and All.

![Supplier Management][supplier-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by suppliers:
   - All shows both active/inactive suppliers
   - Active shows only active suppliers
   - Inactive shows only inactive suppliers
2. User may search for a supplier using the search bar. This will only show suppliers that match the currently selected active/inactive filters.
3. If a supplier is selected from this area, their information will be loaded onto the form. This information can be edited.
4. Clicking Add New Supplier will clear the form so a new supplier may be added. (Note: This will also change the Save button to Add).
5. User may input Supplier information.
6. To save any changes made to a new or existing supplier, the user must click the Add/Save button.
7. Cancel any changes that have not been saved and return to the last page visited.

### Job Types [↑](#table-of-contents)

The Job Type page allows the user to Add, Edit or Inactivate a job type.

![Job Types Management][job-types-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. User may search for a job type using the search bar.
2. If a job type is selected from this area, the information will be loaded onto the form. This information can be edited.
3. Clicking Add New Job Type will clear the form so a new job type may be added. (Note: This will also change the Save button to Add).
4. User may input Job Type information.
5. To save any changes made to a new or existing job type, the user must click the Add/Save button.
6. Cancel any changes that have not been saved and return to the last page visited.

### Pour Types [↑](#table-of-contents)

The Pour Type page allows the user to Add, Edit or Inactivate a pour type. The list of pour types are sorted by their status of Active, Inactive and All.

![Pour Types Management][pour-types-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by pour types:
   - All shows both active/inactive pour types
   - Active shows only active pour types
   - Inactive shows only inactive pour types
2. User may search for a pour type using the search bar. This will only show pour types that match the currently selected active/inactive filters.
3. If a pour type is selected from this area, their information will be loaded onto the form. This information can be edited.
4. Clicking Add New Pour Type will clear the form so a new pour type may be added. (Note: This will also change the Save button to Add).
5. User may input Pour Type information.
6. To save any changes made to a new or existing pour type, the user must click the Add/Save button.
7. Cancel any changes that have not been saved and return to the last page visited.

### Units [↑](#table-of-contents)

The Units page allows the user to Add, Edit or Inactivate a unit. The list of units is sorted by their status of Active, Inactive and All.

![Units Management][units-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by unit:
   - All shows both active/inactive units
   - Active shows only active units
   - Inactive shows only inactive units
2. User may search for a unit using the search bar. This will only show units that match the currently selected active/inactive filters.
3. If a unit is selected from this area, its information will be loaded onto the form. This information can be edited.
4. Clicking Add New Unit will clear the form so a new unit may be added. (Note: This will also change the Save button to Add).
5. User may input Unit information.
6. User may select from a Unit from the dropdown menu.
7. User may select an operator from the dropdown menu.
8. Dates may be selected by clicking the calendar icon on the right side of this field.
9. To save any changes made to a new or existing unit, the user must click the Add/Save button.
10. Cancel any changes that have not been saved and return to the last page visited.

### Customer [↑](#table-of-contents)

The Customer page allows the user to Add, Edit or Inactivate a customer. The list of customers is sorted by their status of Active, Inactive and All.

![Customer Management][customer-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by customers:
   - All shows both active/inactive customers
   - Active shows only active customers
   - Inactive shows only inactive customers
2. User may search for a customer using the search bar. This will only show customers that match the currently selected active/inactive filters.
3. If a customer is selected from this area, their information will be loaded onto the form. This information can be edited.
4. Clicking Add New Customer will clear the form so a new customer may be added. (Note: This will also change the Save button to Add).
5. User may input Customer information.
6. To save any changes made to a new or existing customer, the user must click the Add/Save button.
7. Cancel any changes that have not been saved and return to the last page visited.

### Operator [↑](#table-of-contents)

The Operator page allows the user to Add, Edit or Inactivate an operator. The list of operators is sorted by their status of Active, Inactive and All.

![Operator Management][operator-management]

**\*All the fields that are marked with a \* are required fields\***

**Steps**

1. These submenus allow a user to filter by operators:
   - All shows both active/inactive operators
   - Active shows only active operators
   - Inactive shows only inactive operators
2. User may search for an operator using the search bar. This will only show operators that match the currently selected active/inactive filters.
3. If an operator is selected from this area, their information will be loaded onto the form. This information can be edited.
4. Clicking Add New Operator will clear the form so a new operator may be added. (Note: This will also change the Save button to Add).
5. User may input Operator information.
6. This field contains the phone number that an email will be sent to with the send message feature when SMS is selected.
7. If email is selected, the Send Message feature will send an email to the operators' email. If SMS is selected, the Send Message feature will use Text Message Number to send a text message.
8. When the user clicks Send Message a modal will pop up. If SMS is selected, the user will have to select the service provider that the email to text will be sent to.

![Message Service Provider Modal][message-service-provider-modal]

### Company Information [↑](#table-of-contents)

This page contains all the information about the Company.

![Company Information][company-information]

1. User may change any information about the company here.
2. User may change any of the default rates to be used throughout the application here.
3. User may change any of the SMTP information here.
4. This button tests to see whether the SMPT information is setup properly.
5. This button saves all changes made on this page.
6. Cancel changes and return to last page visited.

## Reporting [↑](#table-of-contents)

All reports have the same header with print button, refresh, page selector, zoom, and page setup. The default top navigation allows access to other pages, reports, job creator, and job board.

![Report Header][report-header]

The Print Page allows the user to print the selected report out.

![Customer History Print][customer-history]

This changes how the reports look and allows the user to change margins, orientation, type of page (letter, legal, A4). Once the page layout is set it will affect how the print will look as well.

![Page Layout Settings][page-layout-settings]

### Customer Job History [↑](#table-of-contents)

For the customer job history, the user can search for a customer by finding them in the drop down. They can also filter the results by using "Search by Unit Sent" which will filter the results based on the unit.

![Customer Select Modal][customer-select-modal]

The Customer Job History displays all of a customer's history that have use the unit that has been searched. If no unit was typed into the search field the report brings back all the jobs that the customer has done.

![Job History Report][job-history-report]

### Amount Pumped by Job Type [↑](#table-of-contents)

![Job Type Filter][job-type-filter]

This allows the user to filter for a select range to see the amounts that were pumped for each job type within the time frame.

![Pumped Amount Report][pumped-amount-report]

This displays the filtered items based off of:
- Job type
- Customers who received the job type
- Pump type used
- Amount of concrete used
- Total job hours
- Hourly rate for the job
- Flat rate

### Amount Pumped by Pump and Date [↑](#table-of-contents)

![Date Range Filter][date-range-filter]

This allows the user to filter for a select range to see the amounts that were pumped for each unit used within the time frame.

![Unit Pumped Amounts][unit-pumped-amounts]

This displays all units used within the time frame and their pumped amounts.

### Amount Poured by Unit Since Pipe Change [↑](#table-of-contents)

![Pipe Change Report][pipe-change-report]

This report displays all units, amounts poured for boom and deck pipes, and last pipe change date.

### Job Count Details [↑](#table-of-contents)

![Customer Filter][customer-filter]

This allows the user to filter for a specific customer.

![Job Count Summary][job-count-summary]

This displays the total jobs for a customer.

### Customer History [↑](#table-of-contents)

The user can access customer history through the right-click menu on a job with their desired customer by selecting "Customer History".

![Customer History View][customer-history-view]

The Customer History shows the customer's entire history with most recent jobs at the top. The layout matches the job board and search functions but doesn't include print functionality.

![Customer History][customer-history-2]

<!-- Image References -->
[login-screen]: /manual-images/login-screen.png
[user-profile-menu]: /manual-images/user-profile-submenu.png
[create-user-form]: /manual-images/create-user-form.png
[job-board-main]: /manual-images/job-board-main-view.png
[time-display]: /manual-images/job-board-time-display.png
[job-status]: /manual-images/job-status-view.png
[search-interface]: /manual-images/job-search-interface.png
[right-click-menu]: /manual-images/job-board-right-click-menu.png
[job-creation-form]: /manual-images/job-creation-form.png
[job-modification-form]: /manual-images/job-modification-form.png
[technician-management]: /manual-images/technician-management-page.png
[supplier-management]: /manual-images/supplier-management-page.png
[job-types-management]: /manual-images/job-types-management.png
[pour-types-management]: /manual-images/pour-types-management.png
[units-management]: /manual-images/units-management-page.png
[customer-management]: /manual-images/customer-management-page.png
[operator-management]: /manual-images/operator-management-page.png
[company-information]: /manual-images/company-information-page.png
[report-header]: /manual-images/report-header.png
[page-layout-settings]: /manual-images/page-layout-settings.png
[customer-job-history]: /manual-images/customer-job-history.png
[job-type-filter]: /manual-images/date-select-modal.png
[pumped-amount-report]: /manual-images/pumped-amount-report.png
[date-range-filter]: /manual-images/date-range-filter.png
[unit-pumped-amounts]: /manual-images/unit-pumped-amounts.png
[pipe-change-report]: /manual-images/pipe-change-report.png
[customer-filter]: /manual-images/no-search-customer-select-modal.png
[job-count-summary]: /manual-images/job-count-summary.png
[customer-history-view]: /manual-images/customer-history-view.png
[search-by-ticket]: /manual-images/search-by-ticket.png
[contact-selection-popup]: /manual-images/contact-selection-popup.png
[message-service-provider-modal]: /manual-images/message-service-provider-modal.png
[customer-history]: /manual-images/customer-history.png
[customer-select-modal]: /manual-images/customer-select-modal.png
[customer-history-2]: /manual-images/customer-history-2.png

© 2024 PumpMasterV3. Developed for 1st Call Concrete Pumping Ltd. by PlanetCom Inc. All rights reserved.
