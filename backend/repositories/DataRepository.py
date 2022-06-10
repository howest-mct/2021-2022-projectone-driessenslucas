from sqlite3 import paramstyle
from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    
    @staticmethod
    def get_logs_from_device(deviceID):
        sql = "SELECT * from logs where deviceID = %s order by volgnummer desc"
        params = [deviceID]
        return Database.get_rows(sql,params)

    @staticmethod
    def get_logs():
        sql = "select * from logs order by actiedatum desc"
        return Database.get_rows(sql)

    @staticmethod
    def get_weekly_log(week_nr):
        sql = "select volgnummer, dayname(actiedatum) as day, Waarde, commentaar,deviceid,actieid,status from logs where YEARWEEK(actiedatum)=YEARWEEK(NOW() - interval %s week) order by volgnummer asc"
        params = [week_nr]
        return Database.get_one_row(sql,params)

    @staticmethod
    def get_latest_value(id):
        sql = "select Waarde from logs where deviceID = %s ORDER BY volgnummer DESC LIMIT 1"
        params = [id]
        return Database.get_one_row(sql,params)

    @staticmethod
    def create_log(value,deviceid,actieid,status,commentaar):
        sql = "INSERT INTO logs(waarde,deviceID,actieID,status,commentaar) VALUES(%s,%s,%s,%s,%s)"
        params = [value,deviceid,actieid,status,commentaar]
        return Database.execute_sql(sql,params)

    @staticmethod
    def delete_readings_today(datum):
        sql = "delete from logs where actiedatum like %s"
        params = [str(datum)+"%"]
        return Database.execute_sql(sql,params)

    @staticmethod
    def get_weekly_weight(week_nr):
        sql = "SELECT Waarde,  dayname(actiedatum) as day from logs WHERE YEARWEEK(actiedatum)=YEARWEEK(NOW() - interval %s week) and deviceID = 3 order by volgnummer asc"
        params = [week_nr]
        return Database.get_rows(sql,params)

    @staticmethod
    def get_weekly_coffee_made(week_nr):
        sql = "SELECT sum(Waarde) as Waarde, dayname(actiedatum) as day from logs WHERE YEARWEEK(actiedatum)=YEARWEEK(NOW() - interval %s week) and deviceID = 4 and actieID = 5 group by `day` order by volgnummer asc"
        params = [week_nr]
        return Database.get_rows(sql,params)
        