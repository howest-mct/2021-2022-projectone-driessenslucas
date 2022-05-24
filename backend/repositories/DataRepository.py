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
    def get_status():
        sql = "SELECT deviceID, status from device"
        return Database.get_rows(sql)

    @staticmethod
    def get_historiek():
        sql = "select * from historiek"
        return Database.get_rows(sql)

    @staticmethod
    def get_specific_historiek(id):
        sql = "select * from historiek where volgnummer = %s"
        params = [id]
        return Database.get_one_row(sql,params)

    @staticmethod
    def get_latest_value(id):
        sql = "select Waarde from historiek where deviceID = %s ORDER BY volgnummer DESC LIMIT 1"
        params = [id]
        return Database.get_one_row(sql,params)

    @staticmethod
    def update_waterlevel(value,deviceid,actieid):
        sql = "INSERT INTO historiek(waarde,deviceID,actieID) VALUES(%s,%s,%s)"
        params = [value,deviceid,actieid]
        return Database.execute_sql(sql,params)