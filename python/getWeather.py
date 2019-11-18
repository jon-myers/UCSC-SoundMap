from noaa_sdk import noaa
n = noaa.NOAA()
res = n.get_observations('95062', 'US', start='2019-04-20', end='2019-4-21')
for i in res: print(i)
