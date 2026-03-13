import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

actor {
  type Report = {
    id : Nat;
    reportType : Text;
    status : Text;
    clientName : Text;
    reportDate : Text;
    reportNumber : Text;
    createdAt : Int;
    content : Text;
  };

  module Report {
    public func compare(report1 : Report, report2 : Report) : Order.Order {
      Nat.compare(report1.id, report2.id);
    };
  };

  let reports = Map.empty<Nat, Report>();
  var nextReportId = 3;

  // Initialize with 2 sample reports
  let sampleReport1 : Report = {
    id = 1;
    reportType = "Property Valuation";
    status = "Completed";
    clientName = "Max Mustermann GmbH";
    reportDate = "2023-11-01";
    reportNumber = "PV-2023-011";
    createdAt = Time.now();
    content = "{ \"propertyDetails\": {\"name\": \"Berlin Apartment\", \"value\": 500000 } }";
  };

  let sampleReport2 : Report = {
    id = 2;
    reportType = "Business Valuation";
    status = "Draft";
    clientName = "Müller Consulting Ltd.";
    reportDate = "2024-02-15";
    reportNumber = "BV-2024-002";
    createdAt = Time.now();
    content = "{ \"businessDetails\": { \"name\": \"Tech Startup GmbH\", \"valuation\": 2000000 } }";
  };

  // Prepopulate the reports Map with sample reports
  reports.add(1, sampleReport1);
  reports.add(2, sampleReport2);

  public shared ({ caller }) func createReport(reportType : Text, clientName : Text) : async Nat {
    let newReport : Report = {
      id = nextReportId;
      reportType;
      status = "Draft";
      clientName;
      reportDate = "";
      reportNumber = "";
      createdAt = Time.now();
      content = "{}";
    };

    reports.add(nextReportId, newReport);
    nextReportId += 1;
    newReport.id;
  };

  public query ({ caller }) func getReport(id : Nat) : async ?Report {
    reports.get(id);
  };

  public query ({ caller }) func listReports() : async [Report] {
    reports.values().toArray().sort();
  };

  public shared ({ caller }) func updateReport(id : Nat, clientName : Text, reportDate : Text, status : Text, content : Text) : async Bool {
    switch (reports.get(id)) {
      case (?existing) {
        let updatedReport : Report = {
          id = existing.id;
          reportType = existing.reportType;
          status;
          clientName;
          reportDate;
          reportNumber = existing.reportNumber;
          createdAt = existing.createdAt;
          content;
        };
        reports.add(id, updatedReport);
        true;
      };
      case (null) { Runtime.trap("Report not found") };
    };
  };

  public shared ({ caller }) func deleteReport(id : Nat) : async Bool {
    if (reports.containsKey(id)) {
      reports.remove(id);
      true;
    } else {
      Runtime.trap("Report not found");
    };
  };
};
