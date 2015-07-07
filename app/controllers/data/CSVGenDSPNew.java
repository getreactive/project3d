package controllers.data;

import java.io.*;
import java.util.Random;
import java.util.Calendar;
import java.util.TimeZone;
/**
 * Created by rahul on 07/07/15.
 */
public class CSVGenDSPNew {
    public static void main(String []args){

        int NUMOFLINES = 20;
        int NUMDAYS = 7;
        int NUMHOURS = 24;

        //char campaign[] = {'A','B','C','D','E','F','G','H','I','J'};
        String sites[] = {"fb.com","flipkart.com","google.com","timesofindia.com","quora.com","youtube.com","amazon.in","snapdeal.com","jabong.com","myntra.com"};
        String adType[] = {"banner","site","video","app"};
        String deviceType[] = {"Mobile","Tablet","Connected Device","Connected TV","Personal Computer","Set Top Box"};
        int creative[] = {1,2,3,4,5,6};
        String geographies[] = {"IN","US","UK","CN","FR","SP","PK","CH","HK","JP"};
        String browsers[] = {"chrome","firefox","opera","safari","IE"};
        int advertisers[] = {12312,21314,14334,41343,12341};

        FileWriter out = null;

        System.out.print("timestamp,advertiser,campaign,site,adType,device,creative,country,browser,impressionCount,");
        System.out.println("clickCount,conversionCount,spend,year,month,day,hour");
		/*Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
		calendar.clear();
		calendar.set(2015, Calendar.JUNE, 1);
		long secondsSinceEpoch = calendar.getTimeInMillis() / 1000L;
		*/
        try{
            out = new FileWriter("output.csv");
            String result;

            long epoch_timestamp = 1433116800;
            int year = 2015;
            int month = 6;
            int first_day = 0;

            for(int i = 0; i < sites.length ; i++){
                String randSite = sites[i];
                int day = first_day;
                for(int j=0; j < NUMDAYS; j++){
                    long current_timestamp = j*3600*24 + epoch_timestamp;
                    day += 1;
                    for(int z = 0; z < 100; z++)
                        for(int k = 0; k < NUMHOURS; k++){
                            current_timestamp = k*3600 + current_timestamp;
                            Random rand = new Random(System.nanoTime());

                            int rnd = rand.nextInt(10);
                            String randCamp = new String("campaign_"+ rnd);
                            int advertiserid = advertisers[rnd%5];
                            String randAdType = adType[rand.nextInt(adType.length)];
                            String randDeviceType = deviceType[rand.nextInt(deviceType.length)];
                            String randCreative = new String("creative_" + creative[rand.nextInt(creative.length)]);
                            String randGeography = geographies[rand.nextInt(geographies.length)];
                            String browser = browsers[rand.nextInt(browsers.length)];
                            int revenue = 100 + (rand.nextInt(4)+1)*100 + rand.nextInt(100);

                            result = new String(current_timestamp + ","+ advertiserid +", "+ randCamp + ", " + randSite + ", " + randAdType + ", " + randDeviceType + ", " + randCreative + ", " + randGeography + ", " + browser+", "+ genImp(rand) +", "+ revenue +", "+ year + ", " + month + ", " +day + ", " + k);
                            System.out.println(result);
                        }

                }

            }


            if(out != null)
                out.close();
        }
        catch(Exception e){

        }

    }

    static String genImp(Random rand){
        int numImp;
        int numClick;
        int numConversion;

        numImp = 100 + rand.nextInt(40) * 10;
        numClick = 8 + (rand.nextInt(20));
        numConversion = 1 + (rand.nextInt(7));

        return new String(numImp + ", " + numClick + ", " + numConversion);
    }

}
